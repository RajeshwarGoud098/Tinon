import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { jobs as defaultJobs, defaultProfile } from "../data/mockData";
import {
  fetchJobs as apiFetchJobs,
  createProfile as apiCreateProfile,
  updateProfile as apiUpdateProfile,
  createApplication as apiCreateApplication,
  fetchApplications as apiFetchApplications,
} from "../services/api";

const AppContext = createContext(null);

// Helpers: persist/restore IDs from localStorage
const storage = {
  getProfileId: () => localStorage.getItem("tinon_profileId"),
  setProfileId: (id) => localStorage.setItem("tinon_profileId", id),
  getProfile: () => {
    try {
      return JSON.parse(localStorage.getItem("tinon_profile"));
    } catch {
      return null;
    }
  },
  setProfile: (p) => localStorage.setItem("tinon_profile", JSON.stringify(p)),
};

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState("home");
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // ── Jobs from API (with fallback to defaultJobs) ──────
  const [jobs, setJobs] = useState(defaultJobs);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);

  // ── Profile (restored from localStorage if available) ─
  const savedProfile = storage.getProfile();
  const [profile, setProfile] = useState(savedProfile || defaultProfile);
  const [profileComplete, setProfileComplete] = useState(!!savedProfile);
  const [profileId, setProfileId] = useState(storage.getProfileId());

  // ── Applications ──────────────────────────────────────
  const [applications, setApplications] = useState([]);

  // ── Skill-Match Filter State ──────────────────────────
  const [skillMatchActive, setSkillMatchActive] = useState(false);
  const [skillMatchTooltip, setSkillMatchTooltip] = useState(false);

  // ── Load jobs from API on mount (fallback to mockData) ─
  useEffect(() => {
    let cancelled = false;
    async function loadJobs() {
      try {
        setJobsLoading(true);
        setJobsError(null);
        const data = await apiFetchJobs();
        if (!cancelled) {
          if (Array.isArray(data) && data.length > 0) {
            setJobs(data);
          } else {
            setJobs(defaultJobs);
          }
        }
      } catch (err) {
        console.warn("API fetch failed, falling back to mock jobs:", err.message);
        if (!cancelled) {
          setJobs(defaultJobs);
        }
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    }
    loadJobs();
    return () => { cancelled = true; };
  }, []);

  // ── Load applications from API when profileId is known ─
  useEffect(() => {
    if (!profileId) return;
    let cancelled = false;
    async function loadApps() {
      try {
        const data = await apiFetchApplications(profileId);
        if (!cancelled) setApplications(data);
      } catch {
        // Silently fail — apps will be empty
      }
    }
    loadApps();
    return () => { cancelled = true; };
  }, [profileId]);

  const toggleSkillMatch = useCallback(() => {
    const userSkills = profile.skills || [];
    if (userSkills.length === 0) {
      setSkillMatchTooltip(true);
      setTimeout(() => setSkillMatchTooltip(false), 3500);
      return;
    }
    setSkillMatchActive((prev) => !prev);
  }, [profile.skills]);

  const toggleFilter = useCallback((filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  // ── Filter jobs (client-side, same logic as before) ───
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = [
          job.business,
          job.type,
          job.description,
          job.address,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      // Skill-match filter: at least one overlap
      if (skillMatchActive && (profile.skills || []).length > 0) {
        const jobSkills = job.requiredSkills || [];
        const hasOverlap = jobSkills.some((sk) => profile.skills.includes(sk));
        if (!hasOverlap) return false;
      }

      // Category filters
      if (activeFilters.length === 0) return true;
      return activeFilters.every((filter) => {
        if (filter === "evening") return job.shift === "evening";
        if (filter === "weekend") return job.weekend;
        if (filter === "immediate") return job.immediate;
        return true;
      });
    });
  }, [jobs, searchQuery, skillMatchActive, profile.skills, activeFilters]);

  const openJobDetail = useCallback((job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  }, []);

  const closeJobDetail = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  }, []);

  // ── Save profile → POST/PUT to API ───────────────────
  const saveProfile = useCallback(
    async (data) => {
      // Optimistic local update
      setProfile(data);
      setProfileComplete(true);
      setShowProfileForm(false);
      storage.setProfile(data);

      try {
        let saved;
        if (profileId) {
          saved = await apiUpdateProfile(profileId, data);
        } else {
          saved = await apiCreateProfile(data);
        }
        const id = saved._id;
        setProfileId(id);
        storage.setProfileId(id);
        storage.setProfile(data);
      } catch (err) {
        console.error("Profile save failed:", err.message);
        // Profile still saved locally — will sync next time
      }
    },
    [profileId]
  );

  // ── Apply to job → POST to API + open WhatsApp ───────
  const applyToJob = useCallback(
    async (job) => {
      const jobId = job._id || job.id;
      const alreadyApplied = applications.some(
        (a) => (a.jobId?._id || a.jobId) === jobId
      );

      if (!alreadyApplied) {
        // Optimistic local update
        const newApp = {
          _id: `temp_${Date.now()}`,
          jobId: jobId,
          business: job.business,
          role: job.type,
          emoji: job.emoji,
          appliedDate: new Date().toISOString(),
          status: "applied",
        };
        setApplications((prev) => [newApp, ...prev]);

        // Sync with backend
        try {
          const saved = await apiCreateApplication({
            jobId,
            profileId: profileId || undefined,
            business: job.business,
            role: job.type,
            emoji: job.emoji,
          });
          // Replace temp entry with real one
          setApplications((prev) =>
            prev.map((a) => (a._id === newApp._id ? saved : a))
          );
        } catch (err) {
          console.error("Application save failed:", err.message);
        }
      }

      // Open WhatsApp
      const message = encodeURIComponent(
        `Hi! I'm interested in the ${job.type} position at ${job.business}. I found this on Tinon Jobs.`
      );
      window.open(`https://wa.me/${job.contact}?text=${message}`, "_blank");
    },
    [applications, profileId]
  );

  const value = {
    activeTab,
    setActiveTab,
    activeFilters,
    toggleFilter,
    searchQuery,
    setSearchQuery,
    filteredJobs,
    jobsLoading,
    jobsError,
    selectedJob,
    drawerOpen,
    openJobDetail,
    closeJobDetail,
    profile,
    setProfile,
    profileComplete,
    saveProfile,
    showProfileForm,
    setShowProfileForm,
    applications,
    applyToJob,
    // Skill-match
    skillMatchActive,
    toggleSkillMatch,
    skillMatchTooltip,
    setSkillMatchTooltip,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
