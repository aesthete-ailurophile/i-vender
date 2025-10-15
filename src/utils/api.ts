import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-36b2d027`;

export async function apiRequest(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
) {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; name: string; role: string }) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Projects API
export const projectsAPI = {
  create: (projectData: any, token: string) =>
    apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
      token,
    }),

  getAll: (token: string) =>
    apiRequest("/projects", {
      method: "GET",
      token,
    }),

  updateMilestone: (projectId: string, milestoneData: any, token: string) =>
    apiRequest(`/projects/${projectId}/milestones`, {
      method: "POST",
      body: JSON.stringify(milestoneData),
      token,
    }),
};

// Mentors API
export const mentorsAPI = {
  getAll: () => apiRequest("/mentors", { method: "GET" }),

  book: (mentorId: string, sessionData: any, token: string) =>
    apiRequest(`/mentors/${mentorId}/book`, {
      method: "POST",
      body: JSON.stringify(sessionData),
      token,
    }),
};

// Campus API
export const campusAPI = {
  reportIssue: (issueData: any, token: string) =>
    apiRequest("/campus/issues", {
      method: "POST",
      body: JSON.stringify(issueData),
      token,
    }),

  getIssues: () => apiRequest("/campus/issues", { method: "GET" }),

  markAttendance: (token: string) =>
    apiRequest("/campus/attendance", {
      method: "POST",
      token,
    }),

  sendEmergency: (alertData: any, token: string) =>
    apiRequest("/campus/emergency", {
      method: "POST",
      body: JSON.stringify(alertData),
      token,
    }),
};

// Sustainability API
export const sustainabilityAPI = {
  recycle: (data: { bottleCount?: number; qrCode?: string }, token: string) =>
    apiRequest("/sustainability/recycle", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  redeem: (rewardData: { rewardId: string; pointsCost: number }, token: string) =>
    apiRequest("/sustainability/redeem", {
      method: "POST",
      body: JSON.stringify(rewardData),
      token,
    }),

  getLeaderboard: () =>
    apiRequest("/sustainability/leaderboard", { method: "GET" }),
};

// Admin API
export const adminAPI = {
  getStats: (token: string) =>
    apiRequest("/admin/stats", {
      method: "GET",
      token,
    }),
};

// Profile API
export const profileAPI = {
  get: (token: string) =>
    apiRequest("/profile", {
      method: "GET",
      token,
    }),
};
