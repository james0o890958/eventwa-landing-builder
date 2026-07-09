import { ReactNode, useEffect, useState } from 'react';
import { LayoutDashboard, Ticket, Bell, MessageSquare, Heart, User } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';

let echo: any = null;
try {
  echo = require('@/lib/echo').default;
} catch { /* Reverb not configured */ }

interface Props {
  children: ReactNode;
}

export default function AttendeeDashboardLayout({ children }: Props) {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const token = localStorage.getItem('access_token') || '';
  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = stored?.id;

  useEffect(() => {
    if (!token) return;
    api.get('notifications?unread=1', undefined, token)
      .then((r: any) => setUnreadNotifications(r?.unread_count ?? 0))
      .catch(() => {});
    api.get('messages?unread=1', undefined, token)
      .then((r: any) => setUnreadMessages(r?.unread_count ?? 0))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!echo || !userId) return;
    echo
      .private(`notifications.${userId}`)
      .listen('.NotificationCreated', () => {
        setUnreadNotifications((n) => n + 1);
      });
    return () => echo.leave(`notifications.${userId}`);
  }, [userId]);

  useEffect(() => {
    if (!echo || !userId) return;
    echo
      .private(`messages.${userId}`)
      .listen('.PrivateMessageSent', () => {
        setUnreadMessages((n) => n + 1);
      });
    return () => echo.leave(`messages.${userId}`);
  }, [userId]);

  const menu = [
    { label: 'Overview', to: '/dashboard', Icon: LayoutDashboard, end: true },
    { label: 'My Tickets', to: '/dashboard/tickets', Icon: Ticket },
    {
      label: 'Notifications',
      to: '/dashboard/notifications',
      Icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    {
      label: 'Messages',
      to: '/messages',
      Icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { label: 'Saved Events', to: '/dashboard/saved', Icon: Heart },
    { label: 'Profile', to: '/dashboard/profile', Icon: User },
  ];

  return (
    <DashboardLayout
      title="My Dashboard"
      subtitle="Manage your tickets, events and profile"
      menu={menu}
    >
      {children}
    </DashboardLayout>
  );
}
