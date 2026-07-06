import { Flag, MessageCircle, MoreHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/ReportDialog";
interface AttendeeListProps {
  eventId: string;
  attendees?: any[];
  onSelectUser?: (userId: string) => void;
}

const AttendeeList = ({ eventId, attendees = [], onSelectUser }: AttendeeListProps) => {
  if (attendees.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6">
      <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
        Attendees ({attendees.length})
      </h2>
      <div className="space-y-4">
        {attendees.map((user: any) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {user.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                {user.location && (
                  <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                    <MapPin className="h-2.5 w-2.5" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectUser?.(user.id)}
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
        ))}
      </div>
    </div>
  );
};

export default AttendeeList;
