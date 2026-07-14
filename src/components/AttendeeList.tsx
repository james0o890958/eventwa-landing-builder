import { Flag, MessageCircle, MoreHorizontal, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/ReportDialog";
import { getFullAvatarUrl } from "@/lib/api";

interface AttendeeListProps {
  eventId: string;
  attendees?: any[];
  onSelectUser?: (user: any) => void;
  onViewProfile?: (user: any) => void;
}

const AttendeeList = ({ eventId, attendees = [], onSelectUser, onViewProfile }: AttendeeListProps) => {
  const visibleAttendees = attendees.filter(
    (user: any) => !user?.privacy_settings?.hide_in_attendee_list && !user?.hide_in_attendee_list
  );

  if (visibleAttendees.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-border/50 bg-card p-8 text-center">
        <Users className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm font-medium text-foreground">No other visible attendees yet</p>
        <p className="text-xs text-muted-foreground mt-1">Other attendees will show up here as they register and enable public visibility.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6">
      <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
        Attendees ({visibleAttendees.length})
      </h2>
      <div className="space-y-4">
        {visibleAttendees.map((user: any) => {
          const userLocation = user.location || (user.city && user.state ? `${user.city.name}, ${user.state.name}` : (user.city?.name || user.state?.name || null));

          return (
            <div key={user.id} className="flex items-center justify-between">
              <div
                onClick={() => onViewProfile?.(user)}
                className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
                title={`View ${user.name}'s profile`}
              >
                <Avatar className="h-10 w-10 border border-border/50 group-hover:border-primary transition-colors">
                  <AvatarImage src={getFullAvatarUrl(user.avatar || user.avatar_url)} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                    {user.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  {userLocation && (
                    <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                      <MapPin className="h-2.5 w-2.5" />
                      <span>{userLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectUser?.(user)}
                  className="h-8 border-primary/20 text-primary hover:bg-primary/5 gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">Message</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onViewProfile?.(user)}
                      className="gap-2 cursor-pointer font-medium"
                    >
                      View Profile
                    </DropdownMenuItem>
                    <ReportDialog targetType="user" targetId={user.id} targetName={user.name}>
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={(event) => event.preventDefault()}
                      >
                        <Flag className="h-4 w-4" />
                        Report account
                      </DropdownMenuItem>
                    </ReportDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendeeList;

