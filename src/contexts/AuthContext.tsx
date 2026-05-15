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
    // Check for custom API session
    const customToken = localStorage.getItem("access_token");
    const customUserStr = localStorage.getItem("user");
    
    if (customToken) {
      try {
        const customUser = customUserStr ? JSON.parse(customUserStr) : {
          id: "custom-user",
          email: "user@example.com",
          user_metadata: { display_name: "User" }
        };
        
        setSession({
          access_token: customToken,
          user: customUser,
          token_type: "bearer",
        } as any);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    if (!AUTH_CONFIG.AUTH_ENABLED) {
      setSession(MOCK_SESSION);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!localStorage.getItem("access_token")) {
          setSession(session);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!localStorage.getItem("access_token")) {
        setSession(session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    
    if (AUTH_CONFIG.AUTH_ENABLED) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      session: session || (!AUTH_CONFIG.AUTH_ENABLED ? MOCK_SESSION : null), 
      user: session?.user || (!AUTH_CONFIG.AUTH_ENABLED ? MOCK_USER : null), 
      loading, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
