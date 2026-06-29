import { Link } from "react-router-dom";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useSavedEvents } from "@/hooks/useBookmark";

const SavedEvents = () => {
  const { data: savedEvents = [], isLoading } = useSavedEvents();

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Bookmark className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Saved Events</h1>
              <p className="text-muted-foreground text-sm">
                {savedEvents.length} event{savedEvents.length !== 1 ? "s" : ""} bookmarked
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : savedEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedEvents.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={i}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <Bookmark className="mb-4 h-16 w-16 text-muted-foreground/20" />
              <h2 className="font-display text-2xl font-semibold text-foreground">
                No saved events yet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Bookmark events you're interested in and they'll appear here.
              </p>
              <Link to="/explore">
                <Button className="mt-6 gradient-primary text-primary-foreground shadow-glow">
                  Explore Events
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedEvents;
