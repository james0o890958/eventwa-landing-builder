import { Link } from "react-router-dom";
import { ArrowLeft, Megaphone, Facebook, Instagram, Twitter, Share2, Users, TrendingUp, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const MarketingTools = () => {
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
                <Megaphone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="rounded-full gradient-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow">
                  Guide
                </span>
                <p className="mt-1 text-sm text-muted-foreground">20 min read</p>
              </div>
            </div>

            <h1 className="mb-6 font-display text-4xl font-bold text-foreground sm:text-5xl">
              Marketing Tools for Event Success
            </h1>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
                <Share2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Social Media</p>
                  <p className="text-sm text-muted-foreground">Built-in sharing</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Audience Reach</p>
                  <p className="text-sm text-muted-foreground">Targeted promotion</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Analytics</p>
                  <p className="text-sm text-muted-foreground">Track performance</p>
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
            {/* Introduction */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Why Marketing Matters for Your Event
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <p className="text-muted-foreground mb-4">
                  Even the best events need great marketing to succeed. With Evently's built-in 
                  marketing tools, you can reach your target audience, build excitement, and 
                  maximize ticket sales without needing a marketing degree.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-secondary p-4">
                    <h4 className="font-semibold text-foreground mb-2">🎯 Targeted Reach</h4>
                    <p className="text-sm text-muted-foreground">
                      Reach people who are actually interested in your event type and location
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <h4 className="font-semibold text-foreground mb-2">📊 Track Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      See what's working and optimize your marketing strategy in real-time
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Media Integration */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Social Media Integration
              </h2>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Facebook className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Facebook Promotion</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Share your event directly to Facebook with optimized images and descriptions.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Event Description for Facebook
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Write a compelling description that will appear when shared on Facebook..."
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Hashtags (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="#EventName #Location #EventType"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    <Facebook className="h-4 w-4" />
                    Share to Facebook
                  </button>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Instagram className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Instagram Stories</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Create Instagram story templates with your event details and QR codes.
                  </p>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                    <div className="text-muted-foreground mb-4">
                      Preview your Instagram story template
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-lg p-4 text-white">
                      <h3 className="font-bold text-lg mb-2">Your Event Name</h3>
                      <p className="text-sm opacity-90 mb-4">Event Date • Venue Name</p>
                      <div className="bg-white rounded p-2 text-black text-center">
                        <p className="text-xs font-semibold">Scan to Buy Tickets</p>
                        <div className="bg-black w-16 h-16 mx-auto mt-2"></div>
                      </div>
                    </div>
                    <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      <Download className="h-4 w-4" />
                      Download Story Template
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Twitter className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Twitter/X Promotion</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Generate tweet templates with hashtags and event links.
                  </p>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-secondary p-4">
                      <p className="font-mono text-sm text-foreground mb-2">Tweet Template:</p>
                      <p className="text-sm text-muted-foreground">
                        🎉 Exciting news! [Event Name] is coming to [City] on [Date]! 🎊
                        📍 [Venue]
                        🎫 Get your tickets now: [Event Link]
                        #EventHashtag #CityEvents
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      <Twitter className="h-4 w-4" />
                      Copy Tweet Template
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Email Marketing */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Email Marketing Tools
              </h2>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Build Your Email List</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Collect emails from interested attendees and send them updates about your event.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        placeholder="You're Invited: [Event Name] - [Date]"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Send Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Email Content
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Write your email content here..."
                      className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Schedule Email
                  </button>
                </div>
              </div>
            </section>

            {/* Analytics and Tracking */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Analytics and Performance Tracking
              </h2>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Real-time Metrics</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/50 p-4">
                      <h4 className="font-semibold text-foreground mb-2">Views</h4>
                      <p className="text-3xl font-bold text-primary">1,234</p>
                      <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                    </div>
                    <div className="rounded-lg border border-border/50 p-4">
                      <h4 className="font-semibold text-foreground mb-2">Shares</h4>
                      <p className="text-3xl font-bold text-primary">89</p>
                      <p className="text-xs text-muted-foreground">+5 from yesterday</p>
                    </div>
                    <div className="rounded-lg border border-border/50 p-4">
                      <h4 className="font-semibold text-foreground mb-2">Conversions</h4>
                      <p className="text-3xl font-bold text-primary">23</p>
                      <p className="text-xs text-muted-foreground">+3 from yesterday</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Share2 className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Traffic Sources</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm font-medium text-foreground">Facebook</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm font-medium text-foreground">Instagram</span>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm font-medium text-foreground">Email</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm font-medium text-foreground">Direct</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section>
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                Marketing Best Practices
              </h2>
              <div className="grid gap-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Timing is Everything</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Start promoting 6-8 weeks before your event</li>
                    <li>• Post on social media 3-4 times per week</li>
                    <li>• Send email reminders 1 week and 1 day before the event</li>
                    <li>• Use countdown posts in the final week</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Visual Content</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use high-quality images that represent your event</li>
                    <li>• Create short video teasers (15-30 seconds)</li>
                    <li>• Include your event logo and branding consistently</li>
                    <li>• Use event hashtags in all your posts</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Engagement Strategies</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Respond to comments and messages promptly</li>
                    <li>• Share behind-the-scenes content</li>
                    <li>• Tag relevant accounts and use location tags</li>
                    <li>• Run giveaways or contests to boost engagement</li>
                  </ul>
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

              {/* Marketing Checklist */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Marketing Checklist</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Create event page</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Share on social media</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Create email campaign</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Monitor analytics</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Engage with audience</span>
                  </label>
                </div>
              </div>

              {/* Support Contact */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Need Marketing Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our marketing experts can help you create a winning strategy.
                </p>
                <div className="space-y-3">
                  <button className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-card transition-colors">
                    <Share2 className="h-4 w-4" />
                    Chat on WhatsApp
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-card transition-colors">
                    Email Marketing Team
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

export default MarketingTools;