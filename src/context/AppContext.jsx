import { createContext, useContext, useState, useCallback } from "react";
import { jobs, mockApplications, defaultProfile } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState("home");
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [profileComplete, setProfileComplete] = useState(false);
  const [applications, setApplications] = useState(mockApplications);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // ── Skill-Match Filter State ──────────────────────────
  const [skillMatchActive, setSkillMatchActive] = useState(false);
  const [skillMatchTooltip, setSkillMatchTooltip] = useState(false);

  const toggleSkillMatch = useCallback(() => {
    const userSkills = profile.skills || [];
    if (userSkills.length === 0) {
      // No skills selected → show tooltip, don't activate
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

  const filteredJobs = jobs.filter((job) => {
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

  const openJobDetail = useCallback((job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  }, []);

  const closeJobDetail = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  }, []);

  const saveProfile = useCallback((data) => {
    setProfile(data);
    setProfileComplete(true);
    setShowProfileForm(false);
  }, []);

  const applyToJob = useCallback(
    (job) => {
      const alreadyApplied = applications.some((a) => a.jobId === job.id);
      if (!alreadyApplied) {
        setApplications((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            jobId: job.id,
            business: job.business,
            role: `${job.type} Helper`,
            emoji: job.emoji,
            appliedDate: new Date().toISOString().split("T")[0],
            status: "applied",
          },
        ]);
      }
      // Open WhatsApp
      const message = encodeURIComponent(
        `Hi! I'm interested in the ${job.type} position at ${job.business}. I found this on Tinon Jobs.`
      );
      window.open(`https://wa.me/${job.contact}?text=${message}`, "_blank");
    },
    [applications]
  );

  const value = {
    activeTab,
    setActiveTab,
    activeFilters,
    toggleFilter,
    searchQuery,
    setSearchQuery,
    filteredJobs,
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
