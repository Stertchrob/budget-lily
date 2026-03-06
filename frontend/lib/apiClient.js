import { supabase } from "./supabaseClient";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data?.session?.access_token;
}

async function request(path, options = {}) {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  const token = await getAccessToken();
  if (!token) throw new Error("Session expired. Please sign in again.");

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
  }
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, payload, formData = false) =>
  request(path, {
    method: "POST",
    headers: formData ? {} : { "Content-Type": "application/json" },
    body: formData ? payload : JSON.stringify(payload),
  });
export const apiPatch = (path, payload) =>
  request(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
