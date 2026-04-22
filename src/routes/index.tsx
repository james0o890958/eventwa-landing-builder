import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Sparkles, ArrowRight, Music, Mic2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-event.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventWa — Discover Unforgettable Events" },
      { name: "description", content: "EventWa is the home of unforgettable concerts, festivals and nights out. Discover, book and live the moment." },
      { property: "og:title", content: "EventWa — Discover Unforgettable Events" },
      { property: "og:description", content: "Discover, book and live unforgettable events near you." },
    ],
  }),
  component: Index,
});

const events = [
  { title: "Neon Nights Festival", date: "Jun 14", city: "Berlin", tag: "Electronic", icon: Music },
  { title: "Sunset Sessions", date: "Jul 02", city: "Lisbon", tag: "Live Music", icon: Mic2 },
  { title: "Aurora Rooftop", date: "Jul 19", city: "Amsterdam", tag: "Party", icon: PartyPopper },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero shadow-glow" />
            <span className="text-xl font-bold tracking-tight">eventwa</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#events" className="hover:text-foreground transition-colors">Events</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#cta" className="hover:text-foreground transition-colors">Hosts</a>
          </nav>
          <Button size="sm" className="bg-gradient-hero text-primary-foreground hover:opacity-90 border-0">
            Get tickets
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-24 min-h-[100vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <img src={heroImage} alt="Festival crowd with stage lights" width={1920} height={1280} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/60 border border-border/60 backdrop-blur text-xs text-muted-foreground mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Over 12,000 events worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-8"
            >
              Live the <span className="text-gradient">moment.</span>
              <br />
              Don't miss <span className="italic font-light">a beat.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10"
            >
              EventWa is your front-row pass to the most electrifying concerts, festivals and gatherings. Curated. Verified. Unforgettable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 border-0 shadow-elegant h-14 px-8 text-base">
                Explore events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-card/40 backdrop-blur border-border/60">
                Host an event
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-glow blur-3xl" />
              <div className="relative bg-gradient-card border border-border/60 rounded-3xl p-6 backdrop-blur-xl shadow-elegant">
                <div className="text-xs text-muted-foreground mb-2">Trending tonight</div>
                <div className="text-2xl font-bold mb-4">Neon Nights · Berlin</div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                  <Calendar className="h-4 w-4" /> Tonight, 22:00
                </div>
                <div className="flex -space-x-2 mb-6">
                  {[340, 250, 95, 180].map((h) => (
                    <div key={h} className="h-9 w-9 rounded-full border-2 border-card" style={{ background: `oklch(0.7 0.2 ${h})` }} />
                  ))}
                </div>
                <Button className="w-full bg-foreground text-background hover:opacity-90">Reserve spot</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-sm text-accent mb-2">// upcoming</div>
              <h2 className="text-4xl md:text-6xl font-bold">This week's heat</h2>
            </div>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-gradient-card border border-border rounded-3xl p-8 overflow-hidden cursor-pointer"
              >
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-hero opacity-20 blur-3xl group-hover:opacity-40 transition-opacity" />
                <e.icon className="h-10 w-10 text-accent mb-8" />
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{e.tag}</div>
                <h3 className="text-2xl font-bold mb-6">{e.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/60 pt-4">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{e.date}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{e.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-card/30">
        <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-12">
          {[
            { icon: Ticket, title: "Instant tickets", desc: "Skip the queue. Tap, pay, go. Tickets in your wallet in seconds." },
            { icon: Sparkles, title: "Curated for you", desc: "We learn what moves you and surface events that match your vibe." },
            { icon: MapPin, title: "Wherever you are", desc: "From rooftops in Lisbon to warehouses in Berlin. The world is your venue." },
          ].map((f) => (
            <div key={f.title}>
              <div className="h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-glow">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-60" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Your next favorite night<br />starts <span className="text-gradient">here.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join over 2 million people discovering events through EventWa.
          </p>
          <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 border-0 shadow-elegant h-14 px-10 text-base">
            Get the app <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-hero" />
            <span className="font-bold text-foreground">eventwa</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
