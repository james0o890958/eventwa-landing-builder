import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Globe, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
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
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-4 text-muted-foreground">
                Last updated: April 2025
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-card">
              <div className="prose prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    1. Introduction
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    At Event Spark, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. Please read this policy carefully. By using Event Spark, you consent to the practices described herein.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Database className="h-5 w-5 text-primary" />
                    2. Information We Collect
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We collect information you provide directly to us, as well as information collected automatically:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li><strong>Account Information:</strong> Name, email, phone number, profile photo, and bio</li>
                    <li><strong>Payment Information:</strong> Card details (processed securely through payment gateways)</li>
                    <li><strong>Event Preferences:</strong> Categories you view, events you save, events you attend</li>
                    <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent, interactions</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Eye className="h-5 w-5 text-primary" />
                    3. How We Use Your Information
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We use the information we collect to:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li>Provide and improve our Platform services</li>
                    <li>Process ticket purchases and send confirmations</li>
                    <li>Personalize your experience with recommendations</li>
                    <li>Send important notifications and updates</li>
                    <li>Prevent fraud and ensure platform security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Globe className="h-5 w-5 text-primary" />
                    3. Information Sharing
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We may share your information with:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li><strong>Event Organizers:</strong> Your name and ticket details for event check-in</li>
                    <li><strong>Payment Processors:</strong> Required details to complete transactions</li>
                    <li><strong>Service Providers:</strong> Third parties who assist our operations</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                  </ul>
                  <p className="mt-4 leading-relaxed text-secondary-foreground/80">
                    We do <strong>not</strong> sell your personal information to third parties. We do not share your payment card details with organizers.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Lock className="h-5 w-5 text-primary" />
                    4. Data Security
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We implement appropriate technical and organizational measures to protect your data:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li>256-bit SSL encryption for all data transmission</li>
                    <li>Secure storage with access controls</li>
                    <li>Regular security audits and monitoring</li>
                    <li>PCI-DSS compliance for payment processing</li>
                    <li>Data pseudonymization where applicable</li>
                  </ul>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Bell className="h-5 w-5 text-primary" />
                    5. Your Rights
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    You have the following rights regarding your data:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Portability:</strong> Request your data in a portable format</li>
                  </ul>
                  <p className="mt-4 leading-relaxed text-secondary-foreground/80">
                    To exercise these rights, go to your Dashboard Settings or contact us at support@evently.ng.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Globe className="h-5 w-5 text-primary" />
                    6. Cookies & Tracking
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We use cookies and similar tracking technologies to:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-secondary-foreground/80">
                    <li>Keep you logged in</li>
                    <li>Remember your preferences</li>
                    <li>Analyze platform usage</li>
                    <li>Improve our services</li>
                  </ul>
                  <p className="mt-4 leading-relaxed text-secondary-foreground/80">
                    You can disable cookies in your browser settings, but this may affect certain Platform features.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    7. Data Retention
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We retain your information for as long as your account is active or as needed to provide services. Account data is deleted within 30 days of account deletion request. Transaction records are retained for compliance purposes for up to 7 years.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Globe className="h-5 w-5 text-primary" />
                    8. Children's Privacy
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    Our Platform is not intended for children under 13. We do not knowingly collect information from children under 13. If we learn of such collection, we will delete the information promptly.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Globe className="h-5 w-5 text-primary" />
                    9. International Transfers
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    Your information may be transferred to and stored on servers outside your country. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    10. Changes to This Policy
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy here and updating the "Last updated" date. Your continued use of the Platform after changes constitutes acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <Lock className="h-5 w-5 text-primary" />
                    11. Contact Us
                  </h2>
                  <p className="mt-3 leading-relaxed text-secondary-foreground/80">
                    If you have questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="mt-3 rounded-xl bg-secondary/50 p-4">
                    <p className="text-foreground">
                      <strong>Event Spark Privacy Team</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: privacy@evently.ng
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

export default PrivacyPolicy;