import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Notifications from "./pages/Notifications.tsx";
import NotificationSettings from "./pages/NotificationSettings.tsx";
import Auth from "./pages/Auth.tsx";
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
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/create-event" element={<CreateEvent />} />
            <Route path="/organizer/edit-event/:id" element={<EditEvent />} />
            <Route path="/organizer/event/:id/attendees" element={<EventAttendees />} />
            <Route path="/organizer/pricing" element={<Pricing />} />
            <Route path="/organizer/resources" element={<OrganizerResources />} />
            <Route path="/organizer/promote" element={<AdvertiseEvents />} />
            <Route path="/organizers" element={<OrganizersPage />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/checkout/:eventId" element={<Checkout />} />
            <Route path="/checkout/confirmation" element={<TicketConfirmation />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/saved-events" element={<SavedEvents />} />
            <Route path="/notifications" element={<Notifications />} />
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/organizer/:id" element={<OrganizerProfile />} />
            <Route path="/become-organizer" element={<BecomeOrganizer />} />
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