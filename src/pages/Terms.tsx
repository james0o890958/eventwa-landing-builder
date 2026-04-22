import { motion } from "framer-motion";
import { FileText, Scale, Shield, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <Scale className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Terms of Service
              </h1>
              <p className="mt-4 text-muted-foreground">
                Last updated: April 2025
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-card">
              <div className="prose prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    By accessing and using Event Spark ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Platform. These terms constitute a legally binding agreement between you and Event Spark.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    2. User Accounts
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating an account and to update your information to keep it accurate. Event Spark reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    3. Ticket Purchases
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    When purchasing tickets through our Platform, you agree to pay the stated price plus any applicable fees. Tickets are non-refundable unless the organizer cancels the event or explicitly offers a refund policy. Event Spark is not responsible for events cancelled by third-party organizers, but we will assist in facilitating refunds when applicable.
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li>All sales are final unless otherwise specified</li>
                    <li>Refunds may be requested up to 48 hours before the event</li>
                    <li>Organizers set their own refund policies</li>
                    <li>Event Spark charges a 5% service fee per ticket</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    4. Prohibited Conduct
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    You agree not to engage in any of the following prohibited activities:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li>Reselling tickets without authorization</li>
                    <li>Using the Platform for illegal purposes</li>
                    <li>Harassing other users or organizers</li>
                    <li>Posting false or misleading information</li>
                    <li>Attempting to hack or compromise the Platform</li>
                    <li>Creating multiple accounts to bypass restrictions</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    5. Intellectual Property
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    All content, designs, and materials on the Platform are the intellectual property of Event Spark or our licensors. You may not copy, reproduce, or distribute any content from the Platform without our prior written permission. Event organizers retain ownership of their event content but grant us license to display and promote their events.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    6. Limitation of Liability
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    Event Spark is provided "as is" without warranties of any kind. We do not guarantee that the Platform will be uninterrupted or error-free. In no event shall Event Spark be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid for tickets in the preceding 12 months.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    7. Organizer Terms
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    If you create events on our Platform as an organizer, you agree to:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li>Provide accurate event information</li>
                    <li>Honor all ticket sales and commitments</li>
                    <li>Host events as advertised or provide alternatives</li>
                    <li>Comply with applicable laws and regulations</li>
                    <li>Process attendee data responsibly</li>
                    <li>Pay applicable platform fees on time</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    8. Termination
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    Event Spark may terminate or suspend your access to the Platform at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, organizers, or the Platform itself. Upon termination, your right to use the Platform immediately ceases.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    9. Changes to Terms
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We reserve the right to modify these Terms of Service at any time. We will post the updated terms with a new "Last updated" date. Your continued use of the Platform after any changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    10. Contact Information
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-3 rounded-xl bg-secondary/50 p-4">
                    <p className="text-foreground">
                      <strong>Event Spark Support</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: support@evently.ng
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Phone: +234 800 EVENTLY
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;