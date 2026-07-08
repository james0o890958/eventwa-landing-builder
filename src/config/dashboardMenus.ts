import {
  LayoutDashboard,
  Ticket,
  Bookmark,
  MessageCircle,
  Users,
  Bell,
  User,
  Settings,
  Calendar,
  Plus,
  MessagesSquare,
  Megaphone,
  CreditCard,
  BookOpen,
  UserCog,
  BarChart3,
  PenTool,
} from "lucide-react";
import type { MenuItem } from "@/components/DashboardLayout";

export const attendeeMenu: MenuItem[] = [
  { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard, end: true },
  { label: "My Tickets", to: "/dashboard/my-tickets", Icon: Ticket },
  { label: "Saved Events", to: "/dashboard/saved-events", Icon: Bookmark },
  { label: "Saved Blogs", to: "/dashboard/saved-blogs", Icon: Bookmark },
  { label: "Messages", to: "/dashboard/messages", Icon: MessageCircle, badge: 3 },
  { label: "Following", to: "/dashboard/following", Icon: Users },
  { label: "Notifications", to: "/dashboard/notifications", Icon: Bell, badge: 2 },
  { label: "Profile", to: "/dashboard/profile/me", Icon: User },
];

export const organizerMenu: MenuItem[] = [
  { label: "Dashboard", to: "/organizer", Icon: LayoutDashboard, end: true },
  { label: "My Events", to: "/organizer/events", Icon: Calendar },
  { label: "Followers", to: "/organizer/followers", Icon: Users },
  { label: "Create Event", to: "/organizer/create-event", Icon: Plus },
  { label: "Blogs", to: "/organizer/blogs", Icon: PenTool },
  { label: "Saved Blogs", to: "/organizer/saved-blogs", Icon: Bookmark },
  { label: "Promote", to: "/organizer/promote", Icon: Megaphone },
  { label: "Analytics", to: "/organizer/analytics", Icon: BarChart3 },
  { label: "Subscriptions", to: "/organizer/subscriptions", Icon: CreditCard },
  { label: "Resources", to: "/organizer/resources", Icon: BookOpen },
  { label: "Settings", to: "/organizer/settings", Icon: UserCog },
];

