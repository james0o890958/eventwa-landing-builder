import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AUTH_CONFIG } from "@/config/authConfig";

// ─── Mock User for Development ──────────────────────────────────────────────
const MOCK_USER: User = {
  id: "mock-user-id",
  email: "demo@eventspark.com",
  user_metadata: { display_name: "Demo User" },
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  created_at: new Date().toISOString(),
};

const MOCK_SESSION: Session = {
  access_token: "mock-token",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "mock-refresh",
  user: MOCK_USER,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AUTH_CONFIG.AUTH_ENABLED) {
      setSession(MOCK_SESSION);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!AUTH_CONFIG.AUTH_ENABLED) {
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      session: AUTH_CONFIG.AUTH_ENABLED ? session : MOCK_SESSION, 
      user: AUTH_CONFIG.AUTH_ENABLED ? (session?.user ?? null) : MOCK_USER, 
      loading, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
