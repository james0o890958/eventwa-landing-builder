import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowRight, ChevronDown } from "lucide-react";
// CHANGED: Removed mockEvents and Event imports — no longer needed for counts or preview
import { categories as staticCategories } from "@/data/mockEvents";
import { api } from "@/lib/api";

interface CategoryMegaMenuProps {
  sidebar?: boolean;
}

// CHANGED: Added numericId to store the DB integer id separately from the slug
interface Category {
  id: string;
  numericId: number;
  label: string;
  icon: string;
  color: string;
  events_count: number;
}

// CHANGED: New PreviewEvent interface to match API response shape instead of mockEvents shape
interface PreviewEvent {
  id: number | string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
}

const CategoryMegaMenu = ({ sidebar = false }: CategoryMegaMenuProps) => {
  // CHANGED: categories now typed as Category[] (includes events_count and numericId), initialised empty
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  // CHANGED: previewEvents and previewLoading are new — replaced getCategoryEvents(mockEvents)
  const [previewEvents, setPreviewEvents] = useState<PreviewEvent[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get("categories");
        const categoriesData = Array.isArray(data) ? data : data.categories || [];
        if (categoriesData.length > 0) {
          const mapped: Category[] = categoriesData.map((cat: any) => {
            const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "";
            const matchedStatic = staticCategories.find(
              (c) => c.id === slug || c.label.toLowerCase() === cat.name?.toLowerCase()
            );
            return {
              id: slug,
              // CHANGED: store numeric DB id — needed for categories/{id}/events API call
              numericId: cat.id,
              label: cat.name,
              icon: matchedStatic?.icon || "🎫",
              color: matchedStatic?.color || "from-slate-500 to-gray-600",
              // CHANGED: events_count from API instead of mockEvents.filter().length
              events_count: cat.events_count ?? 0,
            };
          });
          setCategories(mapped);
        }
      } catch (err) {
        // CHANGED: fallback maps staticCategories to Category[] shape with numericId: 0
        const fallback: Category[] = staticCategories.map((c, i) => ({
          ...c,
          numericId: i + 1,
          events_count: 0,
        }));
        setCategories(fallback);
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // CHANGED: fetches preview events from categories/{numericId}/events on hover or default category on open
  // Previously was getCategoryEvents() which filtered mockEvents locally
  useEffect(() => {
    const activeCategory = hoveredCategory || (isOpen && categories[0]?.id);
    if (!activeCategory) {
      setPreviewEvents([]);
      return;
    }

    const fetchCategoryEvents = async () => {
      setPreviewLoading(true);
      try {
        // CHANGED: use numericId (DB integer) instead of slug — backend route expects numeric category id
        const categoryObj = categories.find((c) => c.id === activeCategory);
        const identifier = categoryObj?.numericId ?? activeCategory;
        const data = await api.get(`categories/${identifier}/events`);
        // CHANGED: normalises response — handles array, data.events, or data.data shapes
        const events = Array.isArray(data) ? data : data.events || data.data || [];
        // CHANGED: maps API fields to PreviewEvent shape
        setPreviewEvents(
          events.slice(0, 3).map((e: any) => ({
            id: e.id,
            title: e.title ?? e.name,
            date: e.start_date ?? e.date,
            location: e.location ?? e.locations?.[0]?.name ?? e.locations?.[0]?.address ?? e.venue ?? "",
            price: e.price ?? 0,
            image: e.banner_image ?? e.image_url ?? e.image ?? "",
          }))
        );
      } catch (err) {
        setPreviewEvents([]);
        console.error("Failed to load category events:", err);
      } finally {
        setPreviewLoading(false);
      }
    };

    fetchCategoryEvents();
  }, [hoveredCategory, categories, isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMouseEnter = () => {
    if (!sidebar) setIsOpen(true);
  };
  const handleMouseLeave = () => {
    if (!sidebar) {
      setIsOpen(false);
      setHoveredCategory(null);
    }
  };

  const currentCategory = hoveredCategory || categories[0]?.id;
  const currentCategoryData = categories.find((c) => c.id === currentCategory);

  // CHANGED: renderEventCard extracted as shared helper — previously duplicated in both sidebar and desktop JSX
const renderEventCard = (event: PreviewEvent) => (
  <Link
    key={event.id}
    to={`/event/${event.id}`}
    onClick={() => { setIsOpen(false); setHoveredCategory(null); }}
    className="group flex gap-3 rounded-xl bg-card/60 p-2 shadow-sm ring-1 ring-border/30 transition-all duration-150 hover:shadow-md hover:ring-primary/30 hover:bg-card"
  >
    {/* CHANGED: added fallback background when image_url is null */}
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        // CHANGED: placeholder shown when no image_url in DB
        <div className="flex h-full w-full items-center justify-center text-xl">
          🎫
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0 py-0.5">
      <h4 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
        {event.title}
      </h4>
      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        {/* CHANGED: only show location if it exists, otherwise hide the element */}
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.location.split(",")[0]}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-sm font-bold text-primary">
        {event.price === 0 ? "Free" : `₦${Number(event.price).toLocaleString()}`}
      </p>
    </div>
  </Link>
);

  // CHANGED: renderPreviewPanel extracted as shared helper — previously duplicated in both sidebar and desktop JSX
  // Also added previewLoading skeleton state — was not present before
  const renderPreviewPanel = () => (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br text-sm">
            {currentCategoryData?.icon}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {currentCategoryData?.label}
          </span>
        </div>
        <Link
          to={`/category/${currentCategory}`}
          onClick={() => { setIsOpen(false); setHoveredCategory(null); }}
          className="text-xs font-medium text-primary hover:underline"
        >
          See all
        </Link>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.1 }}
          className="grid gap-2.5"
        >
          {/* CHANGED: Added loading skeleton — shown while categories/{numericId}/events is fetching */}
          {previewLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 rounded-xl bg-card/60 p-2 ring-1 ring-border/30">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-secondary" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-secondary" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))
          ) : previewEvents.length > 0 ? (
            // CHANGED: previewEvents from API state instead of getCategoryEvents(mockEvents)
            previewEvents.map(renderEventCard)
          ) : (
            <div className="flex h-[120px] items-center justify-center rounded-xl bg-secondary/30">
              <p className="text-sm text-muted-foreground">No events yet</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );

  // CHANGED: renderCategoryList extracted as shared helper — previously duplicated in both sidebar and desktop JSX
  // count now uses category.events_count from API instead of mockEvents.filter().length
  const renderCategoryList = () =>
    categories.map((category) => {
      const isActive = hoveredCategory === category.id;
      return (
        <button
          key={category.id}
          onMouseEnter={() => setHoveredCategory(category.id)}
          onClick={() => {
            navigate(`/category/${category.id}`);
            setIsOpen(false);
            setHoveredCategory(null);
          }}
          className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-150 ${
            isActive
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          }`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-md text-sm ${isActive ? "bg-white/20" : "bg-gradient-to-br " + category.color}`}>
            {category.icon}
          </span>
          <span className={`flex-1 text-sm font-medium ${isActive ? "text-white" : ""}`}>
            {category.label}
          </span>
          {/* CHANGED: was mockEvents.filter((e) => e.category === category.id).length, now category.events_count */}
          <span className={`text-[11px] ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
            {category.events_count}
          </span>
        </button>
      );
    });

  if (sidebar) {
    return (
      <div ref={containerRef} className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Categories
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="mt-2 max-h-[400px] overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg"
            >
              <div className="flex max-h-[400px]">
                <div className="w-[200px] shrink-0 border-r border-border/30 bg-gradient-to-b from-card to-secondary/10 overflow-y-auto">
                  <div className="p-2.5">
                    <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      Categories
                    </p>
                    {/* CHANGED: now calls shared renderCategoryList() */}
                    <div className="space-y-0.5">{renderCategoryList()}</div>
                  </div>
                  <div className="border-t border-border/30 p-2.5">
                    <Link
                      to="/explore"
                      onClick={() => { setIsOpen(false); setHoveredCategory(null); }}
                      className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      View all events
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                {/* CHANGED: now calls shared renderPreviewPanel() */}
                <div className="w-[300px] bg-gradient-to-br from-secondary/20 via-card to-secondary/10 p-4 overflow-y-auto">
                  {currentCategoryData && renderPreviewPanel()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        Categories
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 mt-2 w-[760px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
          >
            <div className="flex">
              <div className="w-[260px] shrink-0 border-r border-border/30 bg-gradient-to-b from-card to-secondary/10">
                <div className="p-2.5">
                  <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    Browse Categories
                  </p>
                  {/* CHANGED: now calls shared renderCategoryList() */}
                  <div className="space-y-0.5">{renderCategoryList()}</div>
                </div>
                <div className="border-t border-border/30 p-2.5">
                  <Link
                    to="/explore"
                    onClick={() => { setIsOpen(false); setHoveredCategory(null); }}
                    className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    View all events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* CHANGED: now calls shared renderPreviewPanel() */}
              <div className="flex-1 bg-gradient-to-br from-secondary/20 via-card to-secondary/10 p-4">
                {currentCategoryData && renderPreviewPanel()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryMegaMenu;