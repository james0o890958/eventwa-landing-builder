import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { categories, mockEvents, Event } from "@/data/mockEvents";

interface CategoryMegaMenuProps {
  sidebar?: boolean;
}

const CategoryMegaMenu = ({ sidebar = false }: CategoryMegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleCategoryHover = (categoryId: string) => {
    setHoveredCategory(categoryId);
  };

  const getCategoryEvents = (categoryId: string): Event[] => {
    return mockEvents.filter((event) => event.category === categoryId).slice(0, 3);
  };

  const currentCategory = hoveredCategory || categories[0]?.id;
  const previewEvents = currentCategory ? getCategoryEvents(currentCategory) : [];
  const currentCategoryData = categories.find((c) => c.id === currentCategory);

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
                {/* Left Panel - Categories */}
                <div className="w-[200px] shrink-0 border-r border-border/30 bg-gradient-to-b from-card to-secondary/10 overflow-y-auto">
                  <div className="p-2.5">
                    <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      Categories
                    </p>
                    <div className="space-y-0.5">
                      {categories.map((category) => {
                        const count = mockEvents.filter((e) => e.category === category.id).length;
                        const isActive = hoveredCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            onMouseEnter={() => handleCategoryHover(category.id)}
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
                            <span className={`text-[11px] ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-border/30 p-2.5">
                    <Link
                      to="/explore"
                      onClick={() => {
                        setIsOpen(false);
                        setHoveredCategory(null);
                      }}
                      className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      View all events
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="w-[300px] bg-gradient-to-br from-secondary/20 via-card to-secondary/10 p-4 overflow-y-auto">
                  {currentCategoryData && (
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
                          onClick={() => {
                            setIsOpen(false);
                            setHoveredCategory(null);
                          }}
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
                          {previewEvents.length > 0 ? (
                            previewEvents.map((event) => (
                              <Link
                                key={event.id}
                                to={`/event/${event.id}`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setHoveredCategory(null);
                                }}
                                className="group flex gap-3 rounded-xl bg-card/60 p-2 shadow-sm ring-1 ring-border/30 transition-all duration-150 hover:shadow-md hover:ring-primary/30 hover:bg-card"
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                  <img
                                    src={event.image}
                                    alt={event.title}
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  />
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
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {event.location.split(",")[0]}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-sm font-bold text-primary">
                                    {event.price === 0 ? "Free" : `₦${event.price.toLocaleString()}`}
                                  </p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="flex h-[120px] items-center justify-center rounded-xl bg-secondary/30">
                              <p className="text-sm text-muted-foreground">No events yet</p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
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
              {/* Left Panel - Categories */}
              <div className="w-[260px] shrink-0 border-r border-border/30 bg-gradient-to-b from-card to-secondary/10">
                <div className="p-2.5">
                  <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    Browse Categories
                  </p>
                  <div className="space-y-0.5">
                    {categories.map((category) => {
                      const count = mockEvents.filter((e) => e.category === category.id).length;
                      const isActive = hoveredCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onMouseEnter={() => handleCategoryHover(category.id)}
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
                          <span className={`text-[11px] ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border/30 p-2.5">
                  <Link
                    to="/explore"
                    onClick={() => {
                      setIsOpen(false);
                      setHoveredCategory(null);
                    }}
                    className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    View all events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="flex-1 bg-gradient-to-br from-secondary/20 via-card to-secondary/10 p-4">
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
                    onClick={() => {
                      setIsOpen(false);
                      setHoveredCategory(null);
                    }}
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
                    {previewEvents.length > 0 ? (
                      previewEvents.map((event) => (
                        <Link
                          key={event.id}
                          to={`/event/${event.id}`}
                          onClick={() => {
                            setIsOpen(false);
                            setHoveredCategory(null);
                          }}
                          className="group flex gap-3 rounded-xl bg-card/60 p-2 shadow-sm ring-1 ring-border/30 transition-all duration-150 hover:shadow-md hover:ring-primary/30 hover:bg-card"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
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
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location.split(",")[0]}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm font-bold text-primary">
                              {event.price === 0 ? "Free" : `₦${event.price.toLocaleString()}`}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="flex h-[120px] items-center justify-center rounded-xl bg-secondary/30">
                        <p className="text-sm text-muted-foreground">No events yet</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryMegaMenu;