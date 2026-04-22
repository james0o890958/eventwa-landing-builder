import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Ticket, LogOut, User, MapPin, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import CategoryMegaMenu from "@/components/CategoryMegaMenu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Ticket className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Even<span className="text-gradient">tly</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/explore" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Explore
          </Link>
          <CategoryMegaMenu />
          <Link to="/organizers" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Organizers
          </Link>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Search + Location inline */}
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary px-3 py-1">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Search events..."
                className="w-32 border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-8"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
              <div className="h-4 w-px bg-border/50" />
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <button onClick={() => setSearchOpen(false)}>
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Search className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
                <DropdownMenuItem className="text-muted-foreground text-xs cursor-default">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/organizer")} className="cursor-pointer">
                  <Ticket className="mr-2 h-4 w-4" /> Organizer Panel
                </DropdownMenuItem>
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
              className="hidden gradient-primary text-primary-foreground shadow-glow hover:opacity-90 md:inline-flex"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}

          <button
            className="rounded-full p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2 p-4">
            <Link to="/" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/explore" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>Explore</Link>
            <Link to="/organizers" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>Organizers</Link>
            <Link to="/blog" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link to="/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link to="/messages" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>Messages</Link>
            {user ? (
              <Button className="mt-2 gradient-primary text-primary-foreground" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</Button>
            ) : (
              <Button className="mt-2 gradient-primary text-primary-foreground" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>Sign In</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
