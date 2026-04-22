import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setLoading(false);
    toast("You're subscribed! 🎉", {
      description: "We'll send the best events straight to your inbox.",
    });
    setEmail("");
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl gradient-primary p-10 text-center shadow-glow"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-white/80" />
              <span className="text-sm font-semibold uppercase tracking-widest text-white/80">
                Newsletter
              </span>
              <Sparkles className="h-6 w-6 text-white/80" />
            </div>

            <h2 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Stay in the Loop
            </h2>
            <p className="mb-8 text-base text-white/70">
              Get the latest events, exclusive deals, and insider picks delivered
              straight to your inbox. No spam — ever.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-white/30 bg-white/15 pl-10 text-white placeholder:text-white/50 focus-visible:ring-white/40"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 bg-white px-6 font-semibold text-primary hover:bg-white/90 disabled:opacity-60"
              >
                {loading ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>

            <p className="mt-4 text-xs text-white/50">
              Join 20,000+ event lovers across Nigeria. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
