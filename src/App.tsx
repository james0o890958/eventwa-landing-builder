import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import CategoryEvents from "./pages/CategoryEvents.tsx";
import Explore from "./pages/Explore.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import DashboardLayout from "./components/DashboardLayout.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { OrganizerProtectedRoute } from "./components/OrganizerProtectedRoute.tsx";
import { attendeeMenu } from "./config/dashboardMenus.ts";
import UserDashboard from "./pages/UserDashboard.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import OrganizerDashboard from "./pages/OrganizerDashboard.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import EditEvent from "./pages/EditEvent.tsx";
import EventAttendees from "./pages/EventAttendees.tsx";
import OrganizersPage from "./pages/OrganizersPage.tsx";
import Pricing from "./pages/Pricing.tsx";
import OrganizerResources from "./pages/OrganizerResources.tsx";
import AdvertiseEvents from "./pages/AdvertiseEvents.tsx";
import HelpCenter from "./pages/HelpCenter.tsx";
import FindMyTickets from "./pages/FindMyTickets.tsx";
import HowToCreateEvent from "./pages/Resources/HowToCreateEvent.tsx";
import MarketingTools from "./pages/Resources/MarketingTools.tsx";
import Resources from "./pages/Resources.tsx";
import Checkout from "./pages/Checkout.tsx";
import TicketConfirmation from "./pages/TicketConfirmation.tsx";
import MyTickets from "./pages/MyTickets.tsx";
import SavedEvents from "./pages/SavedEvents.tsx";
import SavedBlogs from "./pages/SavedBlogs.tsx";
import Notifications from "./pages/Notifications.tsx";
import NotificationSettings from "./pages/NotificationSettings.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Messages from "./pages/Messages.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import Terms from "./pages/Terms.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import OrganizerProfile from "./pages/OrganizerProfile.tsx";
import BecomeOrganizer from "./pages/BecomeOrganizer.tsx";
import HelpTroubleshooting from "./pages/HelpTroubleshooting.tsx";
import HelpPurchaseTickets from "./pages/HelpPurchaseTickets.tsx";
import HelpManageEvents from "./pages/HelpManageEvents.tsx";
import HelpManageAttendees from "./pages/HelpManageAttendees.tsx";
import HelpMonetizeEvents from "./pages/HelpMonetizeEvents.tsx";
import HelpCreateEvents from "./pages/HelpCreateEvents.tsx";
import HelpPaymentIssues from "./pages/HelpPaymentIssues.tsx";
import HelpPromoteEvents from "./pages/HelpPromoteEvents.tsx";
import HelpBecomeOrganizer from "./pages/HelpBecomeOrganizer.tsx";
import Following from "./pages/Following.tsx";
import OrganizerEvents from "./pages/OrganizerEvents.tsx";
import OrganizerAttendees from "./pages/OrganizerAttendees.tsx";
import OrganizerChatrooms from "./pages/OrganizerChatrooms.tsx";
import EventChatroomPage from "./pages/EventChatroomPage.tsx";
import PromoteEvent from "./pages/PromoteEvent.tsx";
import OrganizerSubscriptions from "./pages/OrganizerSubscriptions.tsx";
import OrganizerSettings from "./pages/OrganizerSettings.tsx";
import OrganizerAnalytics from "./pages/OrganizerAnalytics.tsx";
import OrganizerBlogs from "./pages/OrganizerBlogs.tsx";
import CreateBlogPost from "./pages/CreateBlogPost.tsx";

const queryClient = new QueryClient();

const App = () => (
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
                  <DashboardLayout menu={attendeeMenu}>
                    <Outlet />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="saved-events" element={<SavedEvents />} />
              <Route path="saved-blogs" element={<SavedBlogs />} />
              <Route path="messages" element={<Messages />} />
              <Route path="following" element={<Following />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile/me" element={<UserProfile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/my-tickets" element={<Navigate to="/dashboard/my-tickets" replace />} />
            <Route path="/saved-events" element={<Navigate to="/dashboard/saved-events" replace />} />
            <Route path="/saved-blogs" element={<Navigate to="/dashboard/saved-blogs" replace />} />
            <Route path="/messages" element={<Navigate to="/dashboard/messages" replace />} />
            <Route path="/following" element={<Navigate to="/dashboard/following" replace />} />
            <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
            <Route path="/profile/me" element={<Navigate to="/dashboard/profile/me" replace />} />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/organizer/:id" element={<OrganizerProfile />} />
            <Route path="/become-organizer" element={<ProtectedRoute><BecomeOrganizer /></ProtectedRoute>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;