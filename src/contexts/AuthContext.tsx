import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AUTH_CONFIG } from "@/config/authConfig";
import { api } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    avatar?: string;
    is_organizer?: boolean;
  };
  name?: string;
  avatar?: string;
  is_organizer?: boolean;
  created_at?: string;
}

export interface Session {
  access_token: string;
  user: User;
  token_type: string;
}

// ─── Mock User for Development ──────────────────────────────────────────────
const MOCK_USER: User = {
  id: "mock-user-id",
  email: "demo@eventspark.com",
  user_metadata: { display_name: "Demo User" },
};

const MOCK_SESSION: Session = {
  access_token: "mock-token",
  token_type: "bearer",
  user: MOCK_USER,
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  updateUser: () => {},
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
        
        if (customUser) {
          if (!customUser.user_metadata) {
            customUser.user_metadata = {};
          }
          if (!customUser.user_metadata.display_name) {
            customUser.user_metadata.display_name = customUser.name || customUser.email?.split("@")[0] || "User";
          }
          if (!customUser.user_metadata.full_name) {
            customUser.user_metadata.full_name = customUser.name || customUser.user_metadata.display_name;
          }
          if (customUser.user_metadata.is_organizer === undefined) {
            customUser.user_metadata.is_organizer = !!customUser.is_organizer || !!customUser.organizer;
          }
        }
        
        setSession({
          access_token: customToken,
          user: customUser,
          token_type: "bearer",
        });

        // Sync latest profile from backend database
        api.get("profile", undefined, customToken)
          .then((res) => {
            if (res?.user) {
              updateUser(res.user);
            }
          })
          .catch((e) => console.warn("Failed to sync profile on boot", e))
          .finally(() => setLoading(false));

        return;
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    if (!AUTH_CONFIG.AUTH_ENABLED) {
      setSession(MOCK_SESSION);
    } else {
      setSession(null);
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedUser: User) => {
    const customUserStr = localStorage.getItem("user");
    let currentStoredUser = {};
    if (customUserStr) {
      try {
        currentStoredUser = JSON.parse(customUserStr);
      } catch (e) {}
    }
    const resolvedAvatar = updatedUser.avatar || updatedUser.user_metadata?.avatar || updatedUser.user_metadata?.avatar_url || (currentStoredUser as any).avatar || (currentStoredUser as any).user_metadata?.avatar || (currentStoredUser as any).user_metadata?.avatar_url;
    const mergedUser = {
      ...currentStoredUser,
      ...updatedUser,
      avatar: resolvedAvatar,
      user_metadata: {
        ...(currentStoredUser as any).user_metadata,
        ...updatedUser.user_metadata,
        display_name: updatedUser.name || updatedUser.user_metadata?.display_name || (currentStoredUser as any).user_metadata?.display_name,
        avatar: resolvedAvatar,
        avatar_url: resolvedAvatar
      }
    };
    localStorage.setItem("user", JSON.stringify(mergedUser));
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        user: mergedUser
      };
    });
  };

  const signOut = async () => {
    const token = localStorage.getItem("access_token");
    const storedUserStr = localStorage.getItem("user");
    let isOrganizer = false;
    if (storedUserStr) {
      try {
        const u = JSON.parse(storedUserStr);
        isOrganizer = !!u.is_organizer || !!u.organizer || (u.user_metadata && !!u.user_metadata.is_organizer);
      } catch (e) {}
    }

    if (token) {
      try {
        if (isOrganizer) {
          await api.post("organizer-logout", {}, token);
        } else {
          await api.post("user-logout", {}, token);
        }
      } catch (e) {
        console.warn("Backend logout failed:", e);
      }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("organizer_profile");
    
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      session: session || (!AUTH_CONFIG.AUTH_ENABLED ? MOCK_SESSION : null), 
      user: session?.user || (!AUTH_CONFIG.AUTH_ENABLED ? MOCK_USER : null), 
      loading, 
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
