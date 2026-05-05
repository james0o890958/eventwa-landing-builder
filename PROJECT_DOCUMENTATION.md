# Eventwa Landing Builder

## Overview

`eventwa-landing-builder` is a React + Vite event marketplace application with both public event discovery and dashboard experiences for attendees and organizers.

The current codebase includes:
- public landing pages
- event browsing and details
- user authentication flow
- attendee dashboard
- organizer dashboard
- mock data for events, users, and locations
- optional Supabase integration for authentication

---

## Current Status

- `src/config/authConfig.ts` currently has:
  ```ts
  export const AUTH_CONFIG = {
    AUTH_ENABLED: true,
  };
  ```
- This means the app expects real authentication via Supabase.
- The backend is not implemented in Laravel yet; Supabase is currently the only real backend integration in the project.
- If you want to keep it frontend-only for the moment, set `AUTH_ENABLED: false`.

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router DOM
- React Query
- Framer Motion
- Supabase client integration
- Vitest (testing)
- Playwright test dependency

---

## Important Files

### App entry and routing
- `src/main.tsx`
  - mounts React app
- `src/App.tsx`
  - routes setup
  - app providers:
    - `QueryClientProvider`
    - `TooltipProvider`
    - `ThemeProvider`
    - `AuthProvider`

### Authentication
- `src/config/authConfig.ts`
  - toggles auth mode
- `src/contexts/AuthContext.tsx`
  - provides `session`, `user`, `loading`, `signOut`
  - uses mock demo user when auth is disabled
  - uses Supabase auth when enabled
- `src/integrations/supabase/client.ts`
  - Supabase client creation
- `src/pages/Auth.tsx`
  - sign in / sign up / forgot password
- `src/pages/ResetPassword.tsx`
  - password reset handler

### Dashboard configuration
- `src/config/dashboardMenus.ts`
  - attendee menu items
  - organizer menu items

### Core data
- `src/data/mockEvents.ts`
- `src/data/mockBlogs.ts`
- `src/data/mockLocations.ts`
- `src/data/mockUsers.ts`

---

## Application Structure

### Public pages
- `src/pages/Index.tsx`
- `src/pages/EventDetail.tsx`
- `src/pages/CategoryEvents.tsx`
- `src/pages/Explore.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/OrganizersPage.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/HelpCenter.tsx`
- `src/pages/Resources.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/TicketConfirmation.tsx`
- `src/pages/Auth.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/Terms.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/NotFound.tsx`

### Attendee dashboard pages
- `src/pages/UserDashboard.tsx`
- `src/pages/MyTickets.tsx`
- `src/pages/SavedEvents.tsx`
- `src/pages/Messages.tsx`
- `src/pages/Following.tsx`
- `src/pages/Notifications.tsx`
- `src/pages/NotificationSettings.tsx`
- `src/pages/UserProfile.tsx`
- `src/pages/Settings.tsx`

### Organizer pages
- `src/pages/OrganizerDashboard.tsx`
- `src/pages/CreateEvent.tsx`
- `src/pages/EditEvent.tsx`
- `src/pages/EventAttendees.tsx`
- `src/pages/OrganizerEvents.tsx`
- `src/pages/OrganizerAttendees.tsx`
- `src/pages/OrganizerChatrooms.tsx`
- `src/pages/EventChatroomPage.tsx`
- `src/pages/PromoteEvent.tsx`
- `src/pages/OrganizerResources.tsx`
- `src/pages/AdvertiseEvents.tsx`
- `src/pages/OrganizerSubscriptions.tsx`
- `src/pages/OrganizerSettings.tsx`
- `src/pages/OrganizerAnalytics.tsx`
- `src/pages/BecomeOrganizer.tsx`

---

## Main User Activities

### Visitor / Guest
- browse home page
- search and filter events
- view event details
- read blogs
- visit help pages
- view organizers
- go to signup/login pages

### Attendee / Registered user
- sign in/signup
- view tickets
- save events
- follow organizers
- view notifications
- edit profile
- interact with dashboard pages

### Organizer
- create and edit events
- view event attendees
- manage event promotions
- monitor analytics
- manage subscriptions
- access organizer resources
- use chatrooms and announcements

---

## Routing Summary

Key routes from `App.tsx`:

- `/` → Home
- `/event/:id` → Event detail
- `/category/:id` → Category page
- `/explore` → Explore events
- `/blog` → Blog list
- `/blog/:id` → Blog post
- `/auth` → Authentication
- `/reset-password` → Password reset
- `/dashboard/*` → Attendee dashboard
- `/organizer/*` → Organizer area
- `/help/*` → Help section
- `/terms` → Terms
- `/privacy` → Privacy
- `*` → NotFound

---

## Current Backend / Auth Status

### What is built
- Supabase integration exists
- Auth pages call:
  - `supabase.auth.signInWithPassword`
  - `supabase.auth.signUp`
  - `supabase.auth.signInWithOAuth`
  - `supabase.auth.resetPasswordForEmail`
  - `supabase.auth.updateUser`

### What is pending
- Laravel backend is not yet implemented
- If you want Laravel later, you should:
  - build Laravel API endpoints
  - replace Supabase auth calls with Laravel calls
  - update auth context accordingly
  - keep mock frontend mode available during migration

---

## Development Commands

From the project root:

- `npm run dev` — start the app
- `npm run build` — build production
- `npm run build:dev` — build in development mode
- `npm run preview` — preview production build
- `npm run lint` — lint code
- `npm run test` — run tests
- `npm run test:watch` — watch tests

---

## Notes

- `README.md` is currently just a placeholder with `TODO: Document your project here`
- Current auth config is set to real auth mode
- The project is mostly frontend with mock event data
- Changing to a Laravel backend requires replacing the Supabase auth flow, not just toggling `AUTH_CONFIG`

---

## How to create a PDF

1. Copy this documentation into a new file, for example `PROJECT_DOCUMENTATION.md`
2. Open it in VS Code
3. Use a Markdown preview extension or browser print
4. Export or print to PDF

Alternatively:
- use a Markdown-to-PDF tool
- or paste into Word / Google Docs and save as PDF