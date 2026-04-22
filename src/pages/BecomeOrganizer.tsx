import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Store,
  Users,
  TrendingUp,
  Check,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizerName: "",
    bio: "",
    location: "",
    website: "",
    instagram: "",
    twitter: "",
  });

  // Redirect to auth if not logged in
  if (!session) {
    navigate("/auth?redirect=/become-organizer");
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: In production, this would update the user's profile in Supabase
      // to mark them as an organizer and store the organizer details
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("You're now an organizer! 🎉");
      navigate("/organizer/create-event");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Store,
      title: "Create Unlimited Events",
      desc: "Host as many events as you want with full control over ticketing and pricing.",
    },
    {
      icon: Users,
      title: "Reach Thousands",
      desc: "Tap into our growing community of event-goers across Nigeria.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      desc: "Track ticket sales, attendance, and revenue with detailed insights.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Become an Organizer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of event organizers who trust Evently to create,
              promote, and manage unforgettable experiences.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Registration Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Set Up Your Organizer Profile</CardTitle>
                <CardDescription>
                  Tell us about your organization or brand. This information
                  will be displayed on your organizer profile page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizerName" className="font-medium">
                      Organizer Name *
                    </Label>
                    <Input
                      id="organizerName"
                      name="organizerName"
                      placeholder="e.g., Lagos Events Co."
                      value={formData.organizerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell attendees about your organization, the types of events you host, and what makes your events special..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Lagos, Nigeria"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="font-medium">
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="font-medium">
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@yourhandle"
                        value={formData.instagram}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="font-medium">
                        Twitter / X
                      </Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        placeholder="@yourhandle"
                        value={formData.twitter}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Logo Upload Placeholder */}
                  <div className="space-y-2">
                    <Label className="font-medium">Organizer Logo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                    <div className="mt-0.5">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        As an organizer, you are responsible for managing your
                        events and providing a great experience for attendees.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-primary text-primary-foreground shadow-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Setting up your organizer profile...
                      </>
                    ) : (
                      <>
                        <Store className="mr-2 h-5 w-5" />
                        Become an Organizer
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BecomeOrganizer;