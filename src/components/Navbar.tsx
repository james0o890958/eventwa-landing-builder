import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Ticket, LogOut, User, MapPin, MessageCircle, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
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

interface NavbarProps {
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

const Navbar = ({ selectedLocation, onLocationSelect }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
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

  const getFullAvatarUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
    const baseUrl = apiBase.replace(/\/api$/, "");
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
  };

  const userAvatar = user?.avatar ?? user?.user_metadata?.avatar ?? user?.user_metadata?.avatar_url;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/95 backdrop-blur-xl flex items-center px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shrink-0">
            <Ticket className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            Even<span className="text-gradient">tly</span>
          </span>
        </Link>

        {/* Navigation Menus (Left) */}
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

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* Location */}
          <div className="hidden sm:flex items-center">
            <LocationMenu
              selectedLocation={usercity}
              onLocationSelect={(location) => setUsercity(location)}
            />
          </div>

          <ThemeToggle />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-secondary transition-colors focus:outline-none p-1">
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
              <DropdownMenuContent align="end" className="w-56 bg-card border-border/50 mt-2">
                <div className="px-3 py-2 border-b border-border/30">
                  <p className="text-xs font-medium text-foreground truncate">
                    {user.user_metadata?.display_name || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={() => navigate("/profile/me")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                {((user.user_metadata as any)?.is_organizer || user.app_metadata?.app_role === "organizer" || (user as any).organizer) && (
                  <DropdownMenuItem onClick={() => navigate("/organizer")} className="cursor-pointer">
                    <Ticket className="mr-2 h-4 w-4" /> Organizer Panel
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => navigate("/messages")} className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Messages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
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
