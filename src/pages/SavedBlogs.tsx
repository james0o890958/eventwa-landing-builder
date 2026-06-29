import { Link } from "react-router-dom";
import { Bookmark, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSavedBlogs } from "@/hooks/useSavedBlogs";

const SavedBlogs = () => {
  const { data: savedBlogs = [], isLoading } = useSavedBlogs();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/blog" className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Saved Blogs</h1>
        </div>

        {isLoading && (
          <div className="flex justify-center pt-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && savedBlogs.length === 0 && (
          <div className="text-center py-20">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground font-medium">No saved blogs yet.</p>
            <Link to="/blog" className="mt-4 inline-block text-primary hover:underline text-sm">
              Browse blogs
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {savedBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/blog/${blog.id}`}
                className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-all hover:shadow-md"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {blog.category}
                  </span>
                  <h3 className="font-bold text-foreground mt-1 line-clamp-1">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{blog.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{blog.author}</span>
                    <span>·</span>
                    <span>{blog.readTime} read</span>
                    <span>·</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SavedBlogs;

