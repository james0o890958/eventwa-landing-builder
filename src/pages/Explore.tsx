import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Loader2,
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  LayoutGrid,
  ListFilter,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockEvents, categories } from "@/data/mockEvents";

// ─── geo helpers ────────────────────────────────────────────────────────────

const NIGERIAN_CITIES = [
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja", lat: 9.0579, lng: 7.4951 },
  { name: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { name: "Calabar", lat: 4.9517, lng: 8.322 },
  { name: "Ibadan", lat: 7.3776, lng: 3.947 },
  { name: "Owerri", lat: 5.485, lng: 7.0352 },
  { name: "Aba", lat: 5.1066, lng: 7.3667 },
  { name: "Osogbo", lat: 7.7827, lng: 4.5418 },
  { name: "Ota", lat: 6.6918, lng: 3.2335 },
  { name: "Lekki", lat: 6.4698, lng: 3.5852 },
];

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearestCity(lat: number, lng: number) {
  let nearest = NIGERIAN_CITIES[0];
  let minDist = Infinity;
  for (const city of NIGERIAN_CITIES) {
    const d = haversineDistance(lat, lng, city.lat, city.lng);
    if (d < minDist) {
      minDist = d;
      nearest = city;
    }
  }
  return nearest.name;
}

const ALL_CITIES = ["All", ...NIGERIAN_CITIES.map((c) => c.name)];

// ─── date helpers ────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function endOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(23, 59, 59, 999);
  return c;
}

type DateFilter = "all" | "today" | "week" | "month" | "custom";
type PriceFilter = "all" | "free" | "paid";
type TypeFilter = "all" | "physical" | "online";
type SortOption = "trending" | "soonest" | "popular" | "newest";

const Explore = () => {
  // ── search ──────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ── location ─────────────────────────────────────────────────────────────────
  const [city, setCity] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // ── category ─────────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ── date ─────────────────────────────────────────────────────────────────────
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // ── price ────────────────────────────────────────────────────────────────────
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ── type ─────────────────────────────────────────────────────────────────────
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  // ── sort ─────────────────────────────────────────────────────────────────────
  const [sortOption, setSortOption] = useState<SortOption>("trending");

  // ── suggestion dropdown close on outside click ───────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── mobile filter overlay ─────────────────────────────────────────────────────
  const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);

  // ── scroll detection for sticky header ────────────────────────────────────────────
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsScrolled(rect.top <= 64);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── geo ──────────────────────────────────────────────────────────────────────
  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCity(getNearestCity(pos.coords.latitude, pos.coords.longitude));
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 10000 },
    );
  };

  // ── suggestions ──────────────────────────────────────────────────────────────
  const suggestions =
    searchQuery.length >= 2
      ? mockEvents
          .filter((e) =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  // ── filtering pipeline ───────────────────────────────────────────────────────
  let filtered = [...mockEvents];

  // 1. search
  if (searchQuery.trim()) {
    filtered = filtered.filter((e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // 2. city
  if (city) {
    filtered = filtered.filter((e) =>
      e.location.toLowerCase().includes(city.toLowerCase()),
    );
  }

  // 3. category
  if (selectedCategory) {
    filtered = filtered.filter((e) => e.category === selectedCategory);
  }

  // 4. date
  const now = new Date();
  if (dateFilter === "today") {
    filtered = filtered.filter(
      (e) => new Date(e.date).toDateString() === now.toDateString(),
    );
  } else if (dateFilter === "week") {
    const end = new Date(now);
    end.setDate(now.getDate() + 7);
    filtered = filtered.filter((e) => {
      const d = new Date(e.date);
      return d >= startOfDay(now) && d <= endOfDay(end);
    });
  } else if (dateFilter === "month") {
    filtered = filtered.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    });
  } else if (dateFilter === "custom" && customFrom && customTo) {
    const from = startOfDay(new Date(customFrom));
    const to = endOfDay(new Date(customTo));
    filtered = filtered.filter((e) => {
      const d = new Date(e.date);
      return d >= from && d <= to;
    });
  }

  // 5. price
  if (priceFilter === "free") {
    filtered = filtered.filter((e) => e.price === 0);
  } else if (priceFilter === "paid") {
    filtered = filtered.filter((e) => e.price > 0);
    if (minPrice)
      filtered = filtered.filter((e) => e.price >= Number(minPrice));
    if (maxPrice)
      filtered = filtered.filter((e) => e.price <= Number(maxPrice));
  }

  // 6. event type
  if (typeFilter === "online") {
    filtered = filtered.filter((e) => /online|virtual/i.test(e.location));
  } else if (typeFilter === "physical") {
    filtered = filtered.filter((e) => !/online|virtual/i.test(e.location));
  }

  // 7. sort
  if (sortOption === "soonest") {
    filtered = filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } else if (sortOption === "trending" || sortOption === "popular") {
    filtered = filtered.sort((a, b) => b.attendees - a.attendees);
  } else if (sortOption === "newest") {
    filtered = [...filtered].reverse();
  }

  // ── has any non-search filter active ─────────────────────────────────────────
  const hasActiveFilters =
    !!city ||
    !!selectedCategory ||
    dateFilter !== "all" ||
    priceFilter !== "all" ||
    typeFilter !== "all" ||
    sortOption !== "trending";

  const clearFilters = () => {
    setCity(null);
    setSelectedCategory(null);
    setDateFilter("all");
    setCustomFrom("");
    setCustomTo("");
    setPriceFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setTypeFilter("all");
    setSortOption("trending");
  };

  // ── pill helper ──────────────────────────────────────────────────────────────
  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
      active
        ? "gradient-primary text-white shadow-glow"
        : "bg-secondary text-muted-foreground hover:text-foreground"
    }`;

  // ── filter count for mobile button ──────────────────────────────────────────
  const activeFilterCount = [
    city,
    selectedCategory,
    dateFilter !== "all",
    priceFilter !== "all",
    typeFilter !== "all",
    sortOption !== "trending",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Explore Events
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover what's happening around you
          </p>
        </motion.div>

        {/* ── Sticky header with Filter + Sort ────────────────────────────────── */}
        <div
          ref={containerRef}
          className={`sticky top-16 z-30 mb-6 transition-all ${
            isScrolled
              ? "-mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm border-b border-border/50"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Dialog open={filterOverlayOpen} onOpenChange={setFilterOverlayOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="relative gap-2"
                  aria-label="Open filters"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
                <DialogHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm px-6 py-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="flex items-center gap-2 text-xl font-display">
                      <SlidersHorizontal className="h-5 w-5" />
                      Filters
                    </DialogTitle>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Clear all
                      </Button>
                    )}
                  </div>
                </DialogHeader>
                <div className="px-6 py-4 space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search events…"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) =>
                        e.key === "Escape" && setShowSuggestions(false)
                      }
                      className="border-0 bg-transparent pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Location filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <select
                        value={city || "All"}
                        onChange={(e) =>
                          setCity(e.target.value === "All" ? null : e.target.value)
                        }
                        className="flex-1 rounded-lg border border-border/50 bg-secondary px-3 py-2.5 text-sm text-foreground"
                      >
                        {ALL_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={requestLocation}
                        disabled={geoLoading}
                        className="text-xs"
                      >
                        {geoLoading ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <MapPin className="mr-1 h-3 w-3" />
                        )}
                        Use my location
                      </Button>
                    </div>
                  </div>

                  {/* Category filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={pill(!selectedCategory)}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() =>
                            setSelectedCategory(cat.id === selectedCategory ? null : cat.id)
                          }
                          className={pill(selectedCategory === cat.id)}
                        >
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: "all", label: "All Dates" },
                          { id: "today", label: "Today" },
                          { id: "week", label: "This Week" },
                          { id: "month", label: "This Month" },
                          { id: "custom", label: "Custom Range" },
                        ] as { id: DateFilter; label: string }[]
                      ).map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDateFilter(d.id)}
                          className={pill(dateFilter === d.id)}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {dateFilter === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex flex-wrap items-center gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">From</label>
                          <input
                            type="date"
                            value={customFrom}
                            onChange={(e) => setCustomFrom(e.target.value)}
                            className="rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">To</label>
                          <input
                            type="date"
                            value={customTo}
                            onChange={(e) => setCustomTo(e.target.value)}
                            className="rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Price filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Price
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                    {priceFilter === "paid" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex flex-wrap items-center gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">Min ₦</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-28 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground">Max ₦</label>
                          <input
                            type="number"
                            placeholder="Any"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-28 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Event type */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Event Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: "all", label: "All" },
                          { id: "physical", label: "Physical" },
                          { id: "online", label: "Online" },
                        ] as { id: TypeFilter; label: string }[]
                      ).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTypeFilter(t.id)}
                          className={pill(typeFilter === t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sort By
                    </label>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="flex-1 rounded-lg border border-border/50 bg-secondary px-3 py-2.5 text-sm text-foreground"
                      >
                        <option value="trending">Trending</option>
                        <option value="soonest">Soonest</option>
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newly Added</option>
                      </select>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Sort dropdown - always visible */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
              >
                <option value="trending">Trending</option>
                <option value="soonest">Soonest</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newly Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Results bar ─────────────────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            event{filtered.length !== 1 ? "s" : ""}
            {city && (
              <>
                {" "}
                in <span className="font-medium text-primary">{city}</span>
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* ── Event grid ──────────────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <motion.div
            key={`${city}-${selectedCategory}-${dateFilter}-${priceFilter}-${typeFilter}-${sortOption}`}
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
            <SlidersHorizontal className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-semibold text-foreground">
              No events match your filters
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or{" "}
              <button onClick={clearFilters} className="text-primary underline">
                clear all filters
              </button>
              .
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
