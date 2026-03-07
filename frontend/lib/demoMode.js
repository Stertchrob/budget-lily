"use client";

export const DEMO_MODE_KEY = "budget-lily-demo-mode";

export function isDemoMode() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_MODE_KEY) === "true";
}

export function enableDemoMode() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_MODE_KEY, "true");
}

export function disableDemoMode() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_MODE_KEY);
}
