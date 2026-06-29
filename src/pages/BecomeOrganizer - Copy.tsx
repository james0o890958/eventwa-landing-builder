import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Store,
  Users,
  TrendingUp,
  Building2,
  Save,
  Image as ImageIcon,
  MapPin,
  Upload,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
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
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [statesList, setStatesList] = useState<{ id: any; name: string }[]>([]);
  const [allCities, setAllCities] = useState<{ id: any; name: string; state_id: any }[]>([]);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to become an organizer");
      navigate("/login");
    } else {
      const isOrganizer = (user as any).is_organizer || user.user_metadata?.is_organizer || !!(user as any).organizer || !!localStorage.getItem("organizer_profile");
      if (isOrganizer) {
        toast.info("You already have an organizer profile.");
        navigate("/organizer/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await api.get("states");
        setStatesList(Array.isArray(statesData) ? statesData : statesData.states || []);
      } catch (error: any) {
        console.error("Failed to fetch states:", error);
      }
    };
    fetchStates();
  }, []);

  const fetchCities = async (stateId: any) => {
    try {
      const citiesData = await api.get("cities", { state_id: stateId });
      setAllCities(Array.isArray(citiesData) ? citiesData : citiesData.cities || []);
      console.error("Cities are:", citiesData);
    } catch (error: any) {
      console.error("Failed to fetch cities:", error);
      setAllCities([]);
    }
  };

  // Brand profile (mirrors OrganizerSettings)
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  // Logo
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Location
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const filteredCities = allCities;

  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const onStateChange = (value: string) => {
    setState(value);
    setCity(""); // Reset city when state changes
    setStateOpen(false);
    
    const stateId = statesList.find(s => s.name === value)?.id;
    if (stateId) {
      fetchCities(stateId);
    } else {
      setAllCities([]);
    }
  };

  const onCityChange = (value: string) => {
    setCity(value);
    setCityOpen(false);
  };



  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    const isOrganizer = user?.user_metadata?.is_organizer || !!localStorage.getItem("organizer_profile");
    if (isOrganizer) {
      toast.error("You already have an organizer profile.");
      navigate("/organizer/dashboard");
      return;
    }

    setIsLoading(true);
    try {
      const stateId = statesList.find(s => s.name === state)?.id;
      const cityId = allCities.find(c => c.name === city)?.id;
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("address", address);
      if (stateId) formData.append("state_id", stateId.toString());
      if (cityId) formData.append("city_id", cityId.toString());
      if (logoFile) formData.append("logo", logoFile);

      const token = localStorage.getItem("access_token") || undefined;
      await api.post("become-organizer", formData, token);

      // Save organizer info to localStorage so it is available to display on the dashboard & settings
      const organizerProfile = {
        name: name.trim(),
        bio: bio.trim(),
        logo: logo, // Base64 data URL of the logo
        address: address.trim(),
        state: state,
        city: city
      };
      localStorage.setItem("organizer_profile", JSON.stringify(organizerProfile));

      // Update stored user object to reflect organizer status
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          storedUser.is_organizer = true;
          if (!storedUser.user_metadata) {
            storedUser.user_metadata = {};
          }
          storedUser.user_metadata.is_organizer = true;
          storedUser.user_metadata.display_name = storedUser.name || name.trim();
          storedUser.user_metadata.full_name = storedUser.name || name.trim();
          storedUser.organizer = {
            name: name.trim(),
            bio: bio.trim(),
            logo: logo,
            address: address.trim()
          };
          localStorage.setItem("user", JSON.stringify(storedUser));
        } catch (e) {
          console.error("Failed to update stored user info", e);
        }
      }

      toast.success("You're now an organizer! 🎉");
      window.location.href = "/organizer/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
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
              Set up your organizer profile. You can fine-tune everything later in
              your Organizer Settings.
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

          {/* Setup form — mirrors OrganizerSettings sections */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {/* Logo */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <ImageIcon className="h-4 w-4 text-primary" /> Organization Logo
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border/50 bg-muted flex items-center justify-center">
                  {logo ? (
                    <img src={logo} alt="Organization logo" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={fileRef} type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload logo
                  </Button>
                  {logo && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setLogo(null); setLogoFile(null); }}>
                      <X className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">PNG or JPG, square recommended (min 256×256).</p>
                </div>
              </div>
            </section>

            {/* Brand */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> Brand Profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="org-name">Organization name *</Label>
                  <Input
                    id="org-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Lagos Events Co."
                    required
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Bringing unforgettable experiences to Nigeria."
                    className="mt-1"
                  />
                </div>
              </div>
            </section>


            {/* Location */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Location
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Street address</Label>
                  <Input id="address" placeholder="123 Event Avenue" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State</Label>
                  <Popover open={stateOpen} onOpenChange={setStateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={stateOpen}
                        className="w-full justify-between mt-1 font-normal"
                      >
                        {state ? state : "Select state..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandList>
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup>
                            {statesList.map((loc) => (
                              <CommandItem
                                key={loc.id}
                                value={loc.name}
                                onSelect={() => onStateChange(loc.name)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    state === loc.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {loc.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className="w-full justify-between mt-1 font-normal"
                        disabled={!state}
                      >
                        {city ? city : state ? "Select city..." : "Select state first"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandList>
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {filteredCities.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={c.name}
                                onSelect={() => onCityChange(c.name)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    city === c.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </section>



            <CardContent className="px-0">
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
                    <Save className="mr-2 h-5 w-5" />
                    Become an Organizer
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                By continuing you agree to our{" "}
                <a href="/terms" className="text-primary hover:underline">Terms</a> and{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardContent>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BecomeOrganizer;
