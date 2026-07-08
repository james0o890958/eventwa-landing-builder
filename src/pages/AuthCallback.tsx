import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      navigate("/login");
      return;
    }

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        
        localStorage.setItem("access_token", token);
        
        // Map user metadata for frontend AuthContext compatibility
        const isOrganizer = !!userData.is_organizer || !!userData.organizer;
        const mappedUser = {
          ...userData,
          is_organizer: isOrganizer,
          user_metadata: {
            display_name: userData.name || userData.email?.split("@")[0] || "User",
            full_name: userData.name || "User",
            avatar_url: userData.avatar || null,
            is_organizer: isOrganizer,
          }
        };

        localStorage.setItem("user", JSON.stringify(mappedUser));

        // If user has organizer profile info, save it
        if (userData.organizer) {
          const org = userData.organizer;
          const organizerProfile = {
            name: org.name || "",
            bio: org.bio || "",
            logo: org.logo || null,
            address: org.address || "",
            state: org.state?.name || "",
            city: org.city?.name || ""
          };
          localStorage.setItem("organizer_profile", JSON.stringify(organizerProfile));
        }

        toast.success("Welcome!");
        
        // Force refresh / redirect to update AuthContext state
        window.location.href = "/";
      } catch (e) {
        console.error("Failed to parse user info from Google authentication callback", e);
        toast.error("Failed to process user session details. Please try again.");
        navigate("/login");
      }
    } else {
      toast.error("Authentication parameters were missing.");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Completing sign-in, please wait...
        </p>
      </div>
    </div>
  );
}
