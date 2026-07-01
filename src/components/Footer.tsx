import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Ticket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Even<span className="text-gradient">tly</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nigeria's premier event discovery and ticketing platform. Find,
            book, and experience the best events near you.
          </p>
        </div>

        {/* Discover */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">
            Discover
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/explore"
                className="hover:text-foreground transition-colors"
              >
                Explore Events
              </Link>
            </li>
            <li>
              <Link
                to="/category/music"
                className="hover:text-foreground transition-colors"
              >
                Music
              </Link>
            </li>
            <li>
              <Link
                to="/category/sports"
                className="hover:text-foreground transition-colors"
              >
                Sports
              </Link>
            </li>
            <li>
              <Link
                to="/category/conferences"
                className="hover:text-foreground transition-colors"
              >
                Conferences
              </Link>
            </li>
            <li>
              <Link
                to="/category/festivals"
                className="hover:text-foreground transition-colors"
              >
                Festivals
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Organizers */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">
            Organizers
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/become-organizer"
                className="hover:text-foreground transition-colors"
              >
                Become an Organizer
              </Link>
            </li>
            <li>
              <Link
                to="/organizers"
                className="hover:text-foreground transition-colors"
              >
                Host an Event
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/create-event"
                className="hover:text-foreground transition-colors"
              >
                Create Event
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/resources"
                className="hover:text-foreground transition-colors"
              >
                Resources
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/promote"
                className="hover:text-foreground transition-colors"
              >
                Advertise
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">
            Support
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/help"
                className="hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/help/find-tickets"
                className="hover:text-foreground transition-colors"
              >
                Find My Tickets
              </Link>
            </li>
            <li>
              <Link
                to="/community-standards"
                className="hover:text-foreground transition-colors"
              >
                Community Standards
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50 pt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
            <Ticket className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-base font-bold text-foreground">
            Even<span className="text-gradient">tly</span>
          </span>
        </Link>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link
            to="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link to="/help" className="hover:text-foreground transition-colors">
            Help
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          © 2026 Evently. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
