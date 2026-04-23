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
} from "lucide-react";
import type { MenuItem } from "@/components/DashboardLayout";

export const attendeeMenu: MenuItem[] = [
  { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard, end: true },
  { label: "My Tickets", to: "/my-tickets", Icon: Ticket },
  { label: "Saved Events", to: "/saved-events", Icon: Bookmark },
  { label: "Messages", to: "/messages", Icon: MessageCircle, badge: 3 },
  { label: "Following", to: "/following", Icon: Users },
  { label: "Notifications", to: "/notifications", Icon: Bell, badge: 2 },
  { label: "Profile", to: "/profile/me", Icon: User },
  { label: "Settings", to: "/settings", Icon: Settings },
];

export const organizerMenu: MenuItem[] = [
  { label: "Dashboard", to: "/organizer", Icon: LayoutDashboard, end: true },
  { label: "My Events", to: "/organizer/events", Icon: Calendar },
  { label: "Create Event", to: "/organizer/create-event", Icon: Plus },
  { label: "Attendees", to: "/organizer/attendees", Icon: Users },
  { label: "Chatrooms", to: "/organizer/chatrooms", Icon: MessagesSquare },
  { label: "Promote", to: "/organizer/promote", Icon: Megaphone },
  { label: "Analytics", to: "/organizer/analytics", Icon: BarChart3 },
  { label: "Subscriptions", to: "/organizer/subscriptions", Icon: CreditCard },
  { label: "Resources", to: "/organizer/resources", Icon: BookOpen },
  { label: "Settings", to: "/organizer/settings", Icon: UserCog },
];
