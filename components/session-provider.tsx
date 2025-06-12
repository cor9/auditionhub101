"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface SessionContextType {
  user: User | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Initial session:', session?.user?.id);
      console.log('📱 Full user object:', session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      console.log('🔄 New user ID:', session?.user?.id);
      console.log('🔄 Expected user ID: 48c3f5e5-dd4c-49ff-a288-3aacd33b67c1');
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Additional debug logging
  useEffect(() => {
    if (user) {
      console.log('👤 Current user from session provider:', user.id);
      console.log('✅ User is authenticated');
    } else {
      console.log('❌ No user in session provider');
    }
  }, [user]);

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
