import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Ticket, LogOut, User, MapPin, MessageCircle, BookOpen, ChevronDown, Menu, Grid, Home, Compass, Users, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getFullAvatarUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import CategoryMegaMenu from "@/components/CategoryMegaMenu";
import LocationMenu from "@/components/LocationMenu";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

const Navbar = ({ selectedLocation, onLocationSelect }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [localCity, setLocalCity] = useState<string>("Lagos");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const usercity = selectedLocation || localCity;

  const setUsercity = (location: string) => {
    // If a location prop handler is provided, let the parent control state.
    // Otherwise fall back to local navbar state.
    if (onLocationSelect) onLocationSelect(location);
    else setLocalCity(location);
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };



  const userAvatar = user?.avatar ?? user?.user_metadata?.avatar ?? user?.user_metadata?.avatar_url;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/95 backdrop-blur-xl flex items-center px-4 md:px-6">
        {/* Left Section: Mobile Navigation Drawer Icon (Top Left) + Logo */}
        <div className="flex items-center gap-2 mr-4 md:mr-8">
          {/* Mobile Hamburger Menu Icon on Left */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="h-9 w-9 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground flex items-center justify-center transition-colors focus:outline-none border border-border/50"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="w-[82%] sm:w-[350px] bg-card border-border/50 p-0 flex flex-col justify-between shadow-2xl"
              >
                <SheetHeader className="px-5 py-4 border-b border-border/50 text-left flex flex-row items-center justify-between">
                  <Logo iconSize={28} />
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                  {/* Search Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (mobileSearchQuery.trim()) {
                        navigate(`/explore?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="relative"
                  >
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      className="pl-9 bg-secondary/80 border-border/60 text-sm h-10 rounded-xl placeholder:text-muted-foreground focus-visible:ring-primary/50"
                    />
                  </form>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2">
                      MENU
                    </p>

                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
                    >
                      <Home className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>Home</span>
                    </Link>

                    <Link
                      to="/explore"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
                    >
                      <Compass className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>Explore Events</span>
                    </Link>

                    {/* Collapsible Categories Dropdown */}
                    <div className="py-0.5">
                      <button
                        type="button"
                        onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                        className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Grid className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>Categories</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            categoriesDropdownOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {categoriesDropdownOpen && (
                        <div className="mt-1 ml-4 pl-3 border-l-2 border-primary/30 space-y-1 py-1">
                          <Link
                            to="/category/music"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          >
                            <span>🎵</span> Music & Concerts
                          </Link>
                          <Link
                            to="/category/nightlife"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          >
                            <span>🍸</span> Nightlife & Parties
                          </Link>
                          <Link
                            to="/category/sports"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          >
                            <span>⚽</span> Sports & Fitness
                          </Link>
                          <Link
                            to="/category/conferences"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          >
                            <span>💼</span> Tech & Business
                          </Link>
                          <Link
                            to="/category/festivals"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          >
                            <span>🎪</span> Festivals & Culture
                          </Link>
                          <Link
                            to="/explore"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors mt-1"
                          >
                            <span>✨</span> View All Categories
                          </Link>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/organizers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
                    >
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>Organizers</span>
                    </Link>

                    <Link
                      to="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>Blog</span>
                    </Link>
                  </div>

                  <div className="h-[1px] bg-border/60 my-4" />

                  {/* Location Selector */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                      LOCATION
                    </p>
                    <div className="px-1">
                      <LocationMenu
                        selectedLocation={usercity}
                        onLocationSelect={(location) => {
                          setUsercity(location);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex items-center">
            <Logo iconSize={32} />
          </Link>
        </div>

        {/* Navigation Menus (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore
          </Link>

          <CategoryMegaMenu sidebar={false} />

          <Link
            to="/organizers"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Organizers
          </Link>

          <Link
            to="/blog"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>

          {/* Search Section */}
          <div className="flex items-center ml-2">
            <AnimatePresence mode="wait">
              {!searchOpen ? (
                <motion.button
                  key="search-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.div
                  key="search-input"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary px-3 py-1.5 ml-2"
                >
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search events..."
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-5"
                    onBlur={() => {
                      if (!searchInputRef.current?.value) setSearchOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section: Location, Theme Toggle & User Avatar Dropdown (Mobile & Desktop) */}
        <div className="ml-auto flex items-center gap-3">
          {/* Location */}
          <div className="hidden sm:flex items-center">
            <LocationMenu
              selectedLocation={usercity}
              onLocationSelect={(location) => setUsercity(location)}
            />
          </div>

          <ThemeToggle />

          {/* User Avatar Dropdown Menu (Accessible on mobile and desktop) */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-secondary transition-colors focus:outline-none p-1 border border-border/40">
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarImage src={getFullAvatarUrl(userAvatar)} alt={user?.user_metadata?.display_name || user?.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {user?.user_metadata?.display_name
                        ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
                        : user?.email
                        ? user.email.slice(0, 2).toUpperCase()
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 mt-2 z-50">
                <div className="px-3 py-2 border-b border-border/30">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user.user_metadata?.display_name || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>

                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4 text-primary" /> User Dashboard
                </DropdownMenuItem>

                {((user.user_metadata as any)?.is_organizer || user.app_metadata?.app_role === "organizer" || (user as any).organizer) && (
                  <DropdownMenuItem onClick={() => navigate("/organizer")} className="cursor-pointer">
                    <Ticket className="mr-2 h-4 w-4 text-primary" /> Organizer Panel
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => navigate("/profile/me")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/messages")} className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Messages
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-xs px-3"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>

      {/* Spacer to push content down */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
