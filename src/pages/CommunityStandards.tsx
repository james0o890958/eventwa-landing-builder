import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const CommunityStandards = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Home
              </Link>
              {" / "}
              <span className="font-semibold">Community Standards</span>
            </p>
            <h1 className="text-4xl font-bold">Community Standards</h1>
            <p className="text-base leading-7 text-secondary-foreground">
              Eventwa is built on respect, safety, and trust. These standards help keep our community positive and welcoming for event creators, attendees, and everyone who uses the platform.
            </p>
          </div>

          <section className="space-y-4 rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">What we expect from comments</h2>
            <p className="text-sm text-muted-foreground leading-7">
              When leaving comments on blog posts, event pages, or discussions, please make sure your content follows these standards:
            </p>
            <ul className="space-y-3 text-sm text-secondary-foreground">
              <li>• Be respectful — no harassment, hate speech, bullying, or personal attacks.</li>
              <li>• Keep it relevant and on-topic for the event, blog, or discussion thread.</li>
              <li>• Do not post spam, scams, self-promotion, or unrelated advertisements.</li>
              <li>• Avoid graphic violence, sexual content, nudity, or other material that is inappropriate for a broad audience.</li>
              <li>• Do not impersonate another person or organization, or misrepresent your identity.</li>
              <li>• Protect privacy — do not share personal, sensitive, or confidential information.</li>
              <li>• Do not encourage illegal activity, harassment, or behavior that endangers others.</li>
              <li>• Use clear language and avoid misleading or false information.</li>
            </ul>
          </section>

          <section className="space-y-4 rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">What happens when a comment is flagged</h2>
            <p className="text-sm text-muted-foreground leading-7">
              If a comment is flagged for violating community standards, our moderation team will review it quickly. You may receive a notification explaining the reason for the flag and whether the comment was removed or hidden.
            </p>
            <p className="text-sm text-muted-foreground leading-7">
              Flags can be raised for abusive language, spam, misinformation, hate speech, privacy violations, and other content that breaks these rules.
            </p>
            <p className="text-sm text-muted-foreground leading-7">
              Repeated violations can lead to temporary suspension, restricted posting privileges, or permanent account restrictions. If your content is removed, review the standards and update your behavior accordingly.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border border-border/50 bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Why this matters</h2>
            <p className="text-sm text-secondary-foreground leading-7">
              Strong community standards help organizers reach more people, protect attendees, and make Eventwa a trusted place to discover and discuss events.
            </p>
            <p className="text-sm text-secondary-foreground leading-7">
              If you have questions about how to use the platform or what is allowed, visit our <Link to="/help" className="text-primary hover:underline">Help Center</Link>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityStandards;
