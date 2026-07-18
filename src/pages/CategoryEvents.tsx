import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, X, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { mockEvents, categories } from "@/data/mockEvents";
import { api } from "@/lib/api";
import { toast } from "sonner";

type PriceFilter = "all" | "free" | "paid";
type SortOption = "soonest" | "popular" | "price-asc" | "price-desc";

const CategoryEvents = () => {
  const { id } = useParams();
  const category = categories.find((c) => c.id === id);

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("soonest");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("public/events", undefined, undefined, { bypassCache: true });
        if (response.status === "success" && response.events) {
          const rawList = (
            Array.isArray(response.events)
              ? response.events
              : typeof response.events === "object" && response.events !== null
                ? Object.values(response.events)
                : []
          ).filter((be: any) => be && typeof be === "object" && be.id !== undefined && be.id !== null);

          if (rawList.length > 0) {
            const mappedEvents = rawList.map((be: any) => ({
              id: be.id.toString(),
              title: be.title || 'Untitled Event',
              description: be.description || '',
              date: be.start_date || be.date || new Date().toISOString(),
              time: be.start_date ? new Date(be.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (be.time || '18:00'),
              location: (be.locations && Array.isArray(be.locations) && be.locations.length > 0)
                ? (be.locations[0].name || be.locations[0].city || be.locations[0].address || 'Lagos')
                : (be.location ? (typeof be.location === 'object' ? (be.location.name || be.location.city || be.location.address) : be.location) : 'Lagos'),
              image: be.image_url || be.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              price: parseFloat(be.price) || 0,
              organizer: be.organizer ? (typeof be.organizer === 'object' ? be.organizer.name : be.organizer) : 'Unknown',
              attendees: be.capacity || be.attendees || 0,
              category: be.category ? (be.category.slug || be.category.name?.toLowerCase()) : (be.category_slug || 'other'),
            }));
            setEvents(mappedEvents);
          } else {
            setEvents(mockEvents);
          }
        } else {
          setEvents(mockEvents);
        }
      } catch (err: any) {
        console.error("Failed to load category events:", err);
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEvents();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const baseEvents = events.filter((e) => e.category === id);

  const suggestions =
    searchQuery.length >= 2
      ? baseEvents
          .filter((e) =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  // --- filtering ---
  let filtered = [...baseEvents];

  if (searchQuery.trim()) {
    filtered = filtered.filter((e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (priceFilter === "free") {
    filtered = filtered.filter((e) => e.price === 0);
  } else if (priceFilter === "paid") {
    filtered = filtered.filter((e) => e.price > 0);
  }

  // --- sorting ---
  if (sortOption === "soonest") {
    filtered = filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } else if (sortOption === "popular") {
    filtered = filtered.sort((a, b) => b.attendees - a.attendees);
  } else if (sortOption === "price-asc") {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filtered = filtered.sort((a, b) => b.price - a.price);
  }

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
      active
        ? "gradient-primary text-white shadow-glow"
        : "bg-secondary text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        {category ? (
          <>
            {/* Category header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-4"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-3xl shadow-lg`}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {category.label} Events
                </h1>
                <p className="text-muted-foreground">
                  {loading ? (
                    <span>Loading events…</span>
                  ) : error ? (
                    <span className="text-destructive">Failed to load events</span>
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-foreground">
                        {filtered.length}
                      </span>{" "}
                      of {baseEvents.length} event
                      {baseEvents.length !== 1 ? "s" : ""} in{" "}
                      <span className="text-primary font-medium">
                        {category.label}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </motion.div>

            {/* Filters bar */}
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-secondary px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder={`Search ${category.label} events…`}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) =>
                      e.key === "Escape" && setShowSuggestions(false)
                    }
                    className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-8"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border/50 bg-card shadow-card">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchQuery(s.title);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price + Sort row */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Price filter */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Price
                  </p>
                  <div className="flex gap-2">
                    {(
                      [
                        { id: "all", label: "All" },
                        { id: "free", label: "Free" },
                        { id: "paid", label: "Paid" },
                      ] as { id: PriceFilter; label: string }[]
                    ).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPriceFilter(p.id)}
                        className={pill(priceFilter === p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  <select
                    value={sortOption}
                    onChange={(e) =>
                      setSortOption(e.target.value as SortOption)
                    }
                    className="rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
                  >
                    <option value="soonest">📅 Soonest</option>
                    <option value="popular">⭐ Most Popular</option>
                    <option value="price-asc">₦ Price: Low to High</option>
                    <option value="price-desc">₦ Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Events grid */}
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : filtered.length > 0 ? (
              <motion.div
                key={`${searchQuery}-${priceFilter}-${sortOption}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            ) : (
              <div className="py-20 text-center">
                <span className="mb-4 block text-5xl">{category.icon}</span>
                <p className="font-display text-xl font-semibold text-foreground">
                  No events found
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPriceFilter("all");
                    setSortOption("soonest");
                  }}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Category not found
            </h1>
            <Link
              to="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryEvents;
