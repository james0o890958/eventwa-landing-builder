import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User, Search, X, SlidersHorizontal, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockBlogs } from "@/data/mockBlogs";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ── scroll detection for sticky header ────────────────────────────────────────────
  const [isScrolled, setIsScrolled] = useState(false);
  const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);
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

  // Derive unique authors and categories from blog data
  const authors = Array.from(new Set(mockBlogs.map((b) => b.author)));
  const blogCategories = Array.from(new Set(mockBlogs.map((b) => b.category)));

  // Filter logic
  let filtered = [...mockBlogs];

  if (searchQuery.trim()) {
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (selectedAuthor) {
    filtered = filtered.filter((b) => b.author === selectedAuthor);
  }

  if (selectedCategory) {
    filtered = filtered.filter((b) => b.category === selectedCategory);
  }

  const featured = filtered.filter((b) => b.featured);
  const rest = filtered.filter((b) => !b.featured);

  const hasActiveFilters =
    !!selectedAuthor || !!selectedCategory || !!searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor(null);
    setSelectedCategory(null);
  };

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
      active
        ? "gradient-primary text-white shadow-glow"
        : "bg-secondary text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-6 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Blog
          </h1>
          <p className="text-muted-foreground mb-10">
            Stories, guides, and insights from the Evently community
          </p>
        </motion.div>

        {/* Sticky header with Filter button + results count */}
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
                <button className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {[selectedAuthor, selectedCategory, searchQuery].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
                <DialogHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm px-6 py-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="flex items-center gap-2 text-xl font-display">
                      <SlidersHorizontal className="h-5 w-5" />
                      Filters
                    </DialogTitle>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear all
                      </button>
                    )}
                  </div>
                </DialogHeader>
                <div className="px-6 py-4 space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search articles…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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

                  {/* Category chips */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={pill(!selectedCategory)}
                      >
                        All
                      </button>
                      {blogCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            setSelectedCategory(cat === selectedCategory ? null : cat)
                          }
                          className={pill(selectedCategory === cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Author / Organizer filter */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Author / Organizer
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedAuthor(null)}
                        className={pill(!selectedAuthor)}
                      >
                        All Authors
                      </button>
                      {authors.map((author) => (
                        <button
                          key={author}
                          onClick={() =>
                            setSelectedAuthor(author === selectedAuthor ? null : author)
                          }
                          className={pill(selectedAuthor === author)}
                        >
                          {author}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  article{filtered.length !== 1 ? "s" : ""}
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  article{filtered.length !== 1 ? "s" : ""}
                </>
              )}
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="mb-4 block text-5xl">📝</span>
            <p className="font-display text-xl font-semibold text-foreground">
              No articles found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or{" "}
              <button onClick={clearFilters} className="text-primary underline">
                clear all
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            {/* Featured posts */}
            {featured.length > 0 && (
              <div className="mb-12 grid gap-6 lg:grid-cols-2">
                {featured.map((post, i) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative h-80 overflow-hidden rounded-2xl border border-border/50"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                        <h2 className="mb-2 font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedAuthor(
                                post.author === selectedAuthor
                                  ? null
                                  : post.author,
                              );
                            }}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <User className="h-3 w-3" />
                            {post.author}
                          </button>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {/* All posts */}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-card"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                        <h3 className="mb-2 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedAuthor(
                                post.author === selectedAuthor
                                  ? null
                                  : post.author,
                              );
                            }}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <User className="h-3 w-3" />
                            {post.author}
                          </button>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
