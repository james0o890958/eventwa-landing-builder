import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { OrganizerProtectedRoute } from "./components/OrganizerProtectedRoute.tsx";
import AttendeeDashboardLayout from "@/components/AttendeeDashboardLayout";

// Lazy-load all page components so each route ships its own JS chunk.
// Visiting the homepage no longer downloads the JS for every page in the app.
const Index = lazy(() => import("./pages/Index.tsx"));
const EventDetail = lazy(() => import("./pages/EventDetail.tsx"));
const CategoryEvents = lazy(() => import("./pages/CategoryEvents.tsx"));
const Explore = lazy(() => import("./pages/Explore.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.tsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.tsx"));
const OrganizerDashboard = lazy(() => import("./pages/OrganizerDashboard.tsx"));
const CreateEvent = lazy(() => import("./pages/CreateEvent.tsx"));
const EditEvent = lazy(() => import("./pages/EditEvent.tsx"));
const EventAttendees = lazy(() => import("./pages/EventAttendees.tsx"));
const OrganizersPage = lazy(() => import("./pages/OrganizersPage.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const OrganizerResources = lazy(() => import("./pages/OrganizerResources.tsx"));
const AdvertiseEvents = lazy(() => import("./pages/AdvertiseEvents.tsx"));
const HelpCenter = lazy(() => import("./pages/HelpCenter.tsx"));
const FindMyTickets = lazy(() => import("./pages/FindMyTickets.tsx"));
const HowToCreateEvent = lazy(() => import("./pages/Resources/HowToCreateEvent.tsx"));
const MarketingTools = lazy(() => import("./pages/Resources/MarketingTools.tsx"));
const Resources = lazy(() => import("./pages/Resources.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const TicketConfirmation = lazy(() => import("./pages/TicketConfirmation.tsx"));
const MyTickets = lazy(() => import("./pages/MyTickets.tsx"));
const SavedEvents = lazy(() => import("./pages/SavedEvents.tsx"));
const SavedBlogs = lazy(() => import("./pages/SavedBlogs.tsx"));
const Notifications = lazy(() => import("./pages/Notifications.tsx"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.tsx"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Messages = lazy(() => import("./pages/Messages.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const CommunityStandards = lazy(() => import("./pages/CommunityStandards.tsx"));
const OrganizerProfile = lazy(() => import("./pages/OrganizerProfile.tsx"));
const BecomeOrganizer = lazy(() => import("./pages/BecomeOrganizer.tsx"));
const HelpTroubleshooting = lazy(() => import("./pages/HelpTroubleshooting.tsx"));
const HelpPurchaseTickets = lazy(() => import("./pages/HelpPurchaseTickets.tsx"));
const HelpManageEvents = lazy(() => import("./pages/HelpManageEvents.tsx"));
const HelpManageAttendees = lazy(() => import("./pages/HelpManageAttendees.tsx"));
const HelpMonetizeEvents = lazy(() => import("./pages/HelpMonetizeEvents.tsx"));
const HelpCreateEvents = lazy(() => import("./pages/HelpCreateEvents.tsx"));
const HelpPaymentIssues = lazy(() => import("./pages/HelpPaymentIssues.tsx"));
const HelpPromoteEvents = lazy(() => import("./pages/HelpPromoteEvents.tsx"));
const HelpBecomeOrganizer = lazy(() => import("./pages/HelpBecomeOrganizer.tsx"));
const Following = lazy(() => import("./pages/Following.tsx"));
const OrganizerEvents = lazy(() => import("./pages/OrganizerEvents.tsx"));
const OrganizerAttendees = lazy(() => import("./pages/OrganizerAttendees.tsx"));
const OrganizerChatrooms = lazy(() => import("./pages/OrganizerChatrooms.tsx"));
const EventChatroomPage = lazy(() => import("./pages/EventChatroomPage.tsx"));
const PromoteEvent = lazy(() => import("./pages/PromoteEvent.tsx"));
const OrganizerSubscriptions = lazy(() => import("./pages/OrganizerSubscriptions.tsx"));
const OrganizerSettings = lazy(() => import("./pages/OrganizerSettings.tsx"));
const OrganizerAnalytics = lazy(() => import("./pages/OrganizerAnalytics.tsx"));
const OrganizerBlogs = lazy(() => import("./pages/OrganizerBlogs.tsx"));
const CreateBlogPost = lazy(() => import("./pages/CreateBlogPost.tsx"));
const OrganizerFollowers = lazy(() => import("./pages/OrganizerFollowers.tsx"));

import { api } from "@/lib/api";
import { useEffect } from "react";

// Minimal route-level loading fallback — a centered spinner that matches the app theme.
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes cache retention
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // 1. Immediately prewarm backend to prevent Render free-tier cold-start latency
    api.prewarmBackend();

    // 2. Prefetch primary lazy route chunks in idle time for instant navigation
    const prefetchRoutes = () => {
      import("./pages/Explore.tsx");
      import("./pages/EventDetail.tsx");
      import("./pages/CategoryEvents.tsx");
      import("./pages/Blog.tsx");
      import("./pages/Login.tsx");
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchRoutes);
    } else {
      setTimeout(prefetchRoutes, 1000);
    }
  }, []);

  return (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <Toaster />
       <BrowserRouter>
         <ThemeProvider
           attribute="class"
           defaultTheme="dark"
           enableSystem
           disableTransitionOnChange
         >
           <AuthProvider>
             <Sonner />
             <Suspense fallback={<PageLoader />}>
               <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/category/:id" element={<CategoryEvents />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AttendeeDashboardLayout>
                      <Outlet />
                    </AttendeeDashboardLayout>
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserDashboard />} />
                <Route path="my-tickets" element={<MyTickets />} />
                <Route path="tickets" element={<Navigate to="my-tickets" replace />} />
                <Route path="saved-events" element={<SavedEvents />} />
                <Route path="saved" element={<Navigate to="saved-events" replace />} />
                <Route path="saved-blogs" element={<SavedBlogs />} />
                <Route path="messages" element={<Messages />} />
                <Route path="following" element={<Following />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile/me" element={<UserProfile />} />
                <Route path="profile" element={<Navigate to="profile/me" replace />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/my-tickets" element={<Navigate to="/dashboard/my-tickets" replace />} />
              <Route path="/tickets" element={<Navigate to="/dashboard/my-tickets" replace />} />
              <Route path="/saved-events" element={<Navigate to="/dashboard/saved-events" replace />} />
              <Route path="/saved" element={<Navigate to="/dashboard/saved-events" replace />} />
              <Route path="/saved-blogs" element={<Navigate to="/dashboard/saved-blogs" replace />} />
              <Route path="/messages" element={<Navigate to="/dashboard/messages" replace />} />
              <Route path="/following" element={<Navigate to="/dashboard/following" replace />} />
              <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
              <Route path="/profile/me" element={<Navigate to="/dashboard/profile/me" replace />} />
              <Route path="/profile" element={<Navigate to="/dashboard/profile/me" replace />} />
              <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
              <Route path="/organizer" element={<OrganizerProtectedRoute><OrganizerDashboard /></OrganizerProtectedRoute>} />
              <Route path="/organizer/dashboard" element={<OrganizerProtectedRoute><OrganizerDashboard /></OrganizerProtectedRoute>} />
              <Route path="/organizer/create-event" element={<OrganizerProtectedRoute><CreateEvent /></OrganizerProtectedRoute>} />
              <Route path="/organizer/edit-event/:id" element={<OrganizerProtectedRoute><EditEvent /></OrganizerProtectedRoute>} />
              <Route path="/organizer/event/:id/attendees" element={<OrganizerProtectedRoute><EventAttendees /></OrganizerProtectedRoute>} />
              <Route path="/organizer/pricing" element={<OrganizerProtectedRoute><Pricing /></OrganizerProtectedRoute>} />
              <Route path="/organizer/resources" element={<OrganizerProtectedRoute><OrganizerResources /></OrganizerProtectedRoute>} />
              <Route path="/organizer/promote" element={<OrganizerProtectedRoute><AdvertiseEvents /></OrganizerProtectedRoute>} />
              <Route path="/organizers" element={<OrganizersPage />} />
              <Route path="/profile/:id" element={<UserProfile />} />
               <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/checkout/:eventId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
               <Route path="/ticket-confirmation" element={<ProtectedRoute><TicketConfirmation /></ProtectedRoute>} />
              <Route path="/checkout/confirmation" element={<ProtectedRoute><TicketConfirmation /></ProtectedRoute>} />
              <Route path="/organizer/events" element={<OrganizerProtectedRoute><OrganizerEvents /></OrganizerProtectedRoute>} />
              <Route path="/organizer/followers" element={<OrganizerProtectedRoute><OrganizerFollowers /></OrganizerProtectedRoute>} />
              <Route path="/organizer/attendees" element={<OrganizerProtectedRoute><OrganizerAttendees /></OrganizerProtectedRoute>} />
              <Route path="/organizer/chatrooms" element={<OrganizerProtectedRoute><OrganizerChatrooms /></OrganizerProtectedRoute>} />
              <Route path="/organizer/event/:id/chatroom" element={<OrganizerProtectedRoute><EventChatroomPage /></OrganizerProtectedRoute>} />
              <Route path="/organizer/event/:id/promote" element={<OrganizerProtectedRoute><PromoteEvent /></OrganizerProtectedRoute>} />
              <Route path="/organizer/subscriptions" element={<OrganizerProtectedRoute><OrganizerSubscriptions /></OrganizerProtectedRoute>} />
              <Route path="/organizer/settings" element={<OrganizerProtectedRoute><OrganizerSettings /></OrganizerProtectedRoute>} />
              <Route path="/organizer/analytics" element={<OrganizerProtectedRoute><OrganizerAnalytics /></OrganizerProtectedRoute>} />
              <Route path="/organizer/blogs" element={<OrganizerProtectedRoute><OrganizerBlogs /></OrganizerProtectedRoute>} />
              <Route path="/organizer/saved-blogs" element={<OrganizerProtectedRoute><SavedBlogs /></OrganizerProtectedRoute>} />
              <Route path="/organizer/create-blog" element={<OrganizerProtectedRoute><CreateBlogPost /></OrganizerProtectedRoute>} />
              <Route path="/organizer/edit-blog/:id" element={<OrganizerProtectedRoute><CreateBlogPost /></OrganizerProtectedRoute>} />
              <Route path="/notifications/settings" element={<NotificationSettings />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/help/find-tickets" element={<FindMyTickets />} />
              <Route path="/help/troubleshooting" element={<HelpTroubleshooting />} />
              <Route path="/help/purchase-tickets" element={<HelpPurchaseTickets />} />
              <Route path="/help/manage-events" element={<HelpManageEvents />} />
              <Route path="/help/manage-attendees" element={<HelpManageAttendees />} />
              <Route path="/help/monetize-events" element={<HelpMonetizeEvents />} />
              <Route path="/help/create-events" element={<HelpCreateEvents />} />
              <Route path="/help/payment-issues" element={<HelpPaymentIssues />} />
              <Route path="/help/promote-events" element={<HelpPromoteEvents />} />
              <Route path="/help/become-organizer" element={<HelpBecomeOrganizer />} />
              <Route path="/help/resources" element={<Resources />} />
              <Route path="/help/resources/how_to_create_event" element={<HowToCreateEvent />} />
              <Route path="/help/resources/marketing_tools" element={<MarketingTools />} />
              <Route path="/find-tickets" element={<FindMyTickets />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/organizer/:id" element={<OrganizerProfile />} />
              <Route path="/become-organizer" element={<ProtectedRoute><BecomeOrganizer /></ProtectedRoute>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/community-standards" element={<CommunityStandards />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
             </Suspense>
           </AuthProvider>
           </ThemeProvider>
       </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;