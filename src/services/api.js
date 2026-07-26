/**
 * Centralized API client for Tinon backend.
 * Base URL is configured via VITE_API_URL environment variable.
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}

// ── Jobs ────────────────────────────────────────────────────

export async function fetchJobs(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.shift) params.set("shift", filters.shift);
  if (filters.weekend !== undefined) params.set("weekend", filters.weekend);
  if (filters.immediate !== undefined) params.set("immediate", filters.immediate);
  if (filters.skills && filters.skills.length > 0) {
    params.set("skills", filters.skills.join(","));
  }

  const query = params.toString();
  return request(`/jobs${query ? `?${query}` : ""}`);
}

export async function fetchJob(id) {
  return request(`/jobs/${id}`);
}

// ── Profiles ────────────────────────────────────────────────

export async function createProfile(data) {
  return request("/profiles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile(id) {
  return request(`/profiles/${id}`);
}

export async function updateProfile(id, data) {
  return request(`/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ── Applications ────────────────────────────────────────────

export async function fetchApplications(profileId) {
  const query = profileId ? `?profileId=${profileId}` : "";
  return request(`/applications${query}`);
}

export async function createApplication(data) {
  return request("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
