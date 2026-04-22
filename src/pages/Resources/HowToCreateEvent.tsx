import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users, CreditCard, Share2, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const HowToCreateEvent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="container mx-auto px-4">
          <Link
            to="/help"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>

          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="rounded-full gradient-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow">
                  Guide
                </span>
                <p className="mt-1 text-sm text-muted-foreground">15 min read</p>
              </div>
            </div>

            <h1 className="mb-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
              How to Create Your First Event on Evently
            </h1>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">For Organizers</p>
                  <p className="text-sm text-muted-foreground">New to event hosting</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Free to Start</p>
                  <p className="text-sm text-muted-foreground">No upfront costs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
                <Share2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Promotion Tools</p>
                  <p className="text-sm text-muted-foreground">Built-in marketing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1 */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Step 1: Access the Event Creation Dashboard
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">1.1 Navigate to Dashboard</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Log into your Evently account and click on "Create Event" from your dashboard.
                  This will take you to our intuitive event creation interface.
                </p>
                <div className="rounded-xl border border-border/50 bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> If you don't have an account yet, click "Sign Up" and 
                    follow the simple registration process. It takes less than 2 minutes!
                  </p>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Step 2: Fill in Basic Event Information
              </h2>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Share2 className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">2.1 Event Details</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Event Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Lagos Tech Conference 2025"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Event Category
                      </label>
                      <select className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Select category</option>
                        <option>Conference</option>
                        <option>Workshop</option>
                        <option>Concert</option>
                        <option>Sports</option>
                        <option>Social</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">2.2 Date & Time</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">2.3 Location</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Eko Convention Centre"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Lagos"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Step 3: Set Up Ticketing
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">3.1 Create Ticket Types</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Add different ticket tiers to accommodate various attendee needs and budgets.
                </p>
                
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Ticket Name
                      </label>
                      <input
                        type="text"
                        placeholder="General Admission"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        placeholder="5000"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    <CreditCard className="h-4 w-4" />
                    Add Another Ticket Type
                  </button>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Step 4: Add Event Description & Media
              </h2>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Share2 className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">4.1 Event Description</span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Describe your event in detail. What will attendees experience? Who should attend? What makes this event special?"
                    className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">4.2 Upload Event Image</span>
                  </div>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <div className="text-muted-foreground mb-4">
                      Drag and drop your event banner here, or click to browse
                    </div>
                    <input type="file" accept="image/*" className="hidden" />
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors">
                      Choose Image
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Recommended size: 1200x630 pixels for optimal display
                  </p>
                </div>
              </div>
            </section>

            {/* Step 5 */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Step 5: Publish and Promote
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">5.1 Go Live</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-3">
                      Review all your event details and click "Publish Event" to make it live.
                    </p>
                    <button className="w-full rounded-lg gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
                      Publish Event
                    </button>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-3">
                      Your event is now live! Share it on social media to start attracting attendees.
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors">
                        Share on Facebook
                      </button>
                      <button className="flex-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors">
                        Share on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips Section */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Pro Tips for Event Success
              </h2>
              <div className="grid gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Early Bird Strategy</h3>
                  <p className="text-muted-foreground">
                    Create an "Early Bird" ticket type with a discounted price for the first 20-30% of tickets. 
                    This creates urgency and helps you build momentum early.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Compelling Description</h3>
                  <p className="text-muted-foreground">
                    Use specific details about what attendees will experience. Include speaker names, 
                    agenda highlights, and any special features that make your event unique.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Visual Appeal</h3>
                  <p className="text-muted-foreground">
                    Use high-quality images that accurately represent your event. Include photos of 
                    the venue, speakers, or previous events if available.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/organizer/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      → Organizer Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/organizer/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      → More Resources
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      → Help Center
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Download Guide */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Download PDF Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get this guide as a downloadable PDF for offline reference.
                </p>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>

              {/* Support Contact */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is here to help you create a successful event.
                </p>
                <div className="space-y-3">
                  <button className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-card transition-colors">
                    <Share2 className="h-4 w-4" />
                    Chat on WhatsApp
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-card transition-colors">
                    Email Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowToCreateEvent;