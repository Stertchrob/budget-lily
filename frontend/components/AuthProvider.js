"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({ user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "SIGNED_OUT") router.push("/login");
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
