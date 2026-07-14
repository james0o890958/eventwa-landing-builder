import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, MessageCircle, Flag, Shield, User as UserIcon } from "lucide-react";
import { getFullAvatarUrl, api } from "@/lib/api";
import ReportDialog from "@/components/ReportDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { useNavigate } from "react-router-dom";

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | number | null;
  user?: any;
  onSendMessage?: (user: any) => void;
}

export const PublicProfileModal = ({
  isOpen,
  onClose,
  userId,
  user: initialUser,
  onSendMessage,
}: PublicProfileModalProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(initialUser || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setProfile(initialUser);
    }
  }, [initialUser]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    // Fetch fresh profile data if needed
    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await api.get(`profile/${userId}`, undefined, token || undefined);
        if (res?.user) {
          setProfile(res.user);
        }
      } catch (err) {
        console.warn("Could not load full public profile details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const displayUser = profile || initialUser || {};
  const name = displayUser.name || displayUser.display_name || "Eventwa User";
  const avatar = getFullAvatarUrl(displayUser.avatar || displayUser.avatar_url);
  const location = displayUser.location || (displayUser.city && displayUser.state ? `${displayUser.city}, ${displayUser.state}` : (displayUser.city?.name || displayUser.state?.name || null));
  const bio = displayUser.bio || null;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  const joinedDate = displayUser.created_at
    ? new Date(displayUser.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  const targetUserId = displayUser.id || userId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border border-border/60 bg-card shadow-2xl rounded-2xl">
        {/* Header Cover Banner */}
        <div className="h-24 gradient-primary relative opacity-90" />

        {/* Profile Details Container */}
        <div className="px-6 pb-6 relative pt-0">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <Avatar className="h-20 w-20 border-4 border-card shadow-lg shrink-0">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  if (onSendMessage) {
                    onSendMessage({
                      id: targetUserId,
                      name,
                      avatar,
                      location: location || "Location undisclosed",
                      initials,
                      bio,
                    });
                  } else if (targetUserId) {
                    navigate(`/messages?user=${targetUserId}`);
                  }
                }}
                className="gradient-primary text-primary-foreground gap-1.5 h-9 px-4 rounded-xl shadow-glow font-semibold"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <ReportDialog targetType="user" targetId={String(displayUser.id || userId)} targetName={name}>
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Flag className="h-4 w-4" />
                      Report user profile
                    </DropdownMenuItem>
                  </ReportDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-display text-foreground leading-snug flex items-center gap-2">
              {name}
              {displayUser.is_organizer && (
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  Organizer
                </span>
              )}
            </h2>

            {location && (
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </div>
            )}

            {bio ? (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {bio}
              </p>
            ) : (
              <p className="mt-3 text-xs italic text-muted-foreground/60">
                No bio provided yet.
              </p>
            )}

            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              {joinedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>Joined {joinedDate}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-emerald-500 font-medium">
                <Shield className="h-3.5 w-3.5" />
                <span>Verified Account</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublicProfileModal;
