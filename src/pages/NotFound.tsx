import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Ticket } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="container mx-auto max-w-2xl text-center">
          {/* 404 Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="text-[10rem] md:text-[12rem] font-bold text-primary/10 absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                404
              </div>
              <div className="text-[10rem] md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 relative select-none">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off into the digital void.
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              <Ticket className="h-5 w-5" />
              Back to Home
            </Link>
          </div>

          {/* Popular destinations */}
          <div className="mt-12 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-4">Or explore:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/explore" className="px-4 py-2 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors">
                Browse Events
              </Link>
              <Link to="/blog" className="px-4 py-2 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors">
                Read Blog
              </Link>
              <Link to="/help" className="px-4 py-2 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
