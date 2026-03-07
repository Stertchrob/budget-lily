"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { demoUser } from "../lib/demoData";
import { disableDemoMode, enableDemoMode, isDemoMode } from "../lib/demoMode";

const AuthContext = createContext({
  user: null,
  loading: true,
  isDemo: false,
  startDemo: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isDemoMode()) {
      setUser(demoUser);
      setIsDemo(true);
      setLoading(false);
      return undefined;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setIsDemo(false);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (isDemoMode()) return;
      setUser(session?.user || null);
      if (event === "SIGNED_OUT") router.push("/login");
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  async function startDemo() {
    enableDemoMode();
    setUser(demoUser);
    setIsDemo(true);
    setLoading(false);
    router.push("/dashboard");
  }

  async function signOut() {
    if (isDemoMode()) {
      disableDemoMode();
      setUser(null);
      setIsDemo(false);
      router.push("/login");
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setIsDemo(false);
    router.push("/login");
  }

  return <AuthContext.Provider value={{ user, loading, isDemo, startDemo, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
