import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, BookOpen, Calendar, Clock, Tag } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface BlogPost {
  id: string | number;
  title: string;
  category: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  created_at?: string;
}

const OrganizerBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      const res = await api.get("organizer/blogs", undefined, token);
      
      // Support standard API formats
      if (res && (res.status === "success" || Array.isArray(res))) {
        const rawBlogs = Array.isArray(res) ? res : (res.blogs || res.data || []);
        
        const mapped = rawBlogs.map((b: any) => ({
          id: String(b.id),
          title: b.title || "Untitled Post",
          category: b.category || "General",
          content: b.content || "",
          image: b.image || b.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
          date: b.date || b.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          readTime: b.readTime || b.read_time || "3 min read",
          author: b.author?.name || b.author || "Organizer",
        }));
        
        setBlogs(mapped);
      }
    } catch (error: any) {
      console.error("Failed to load organizer blogs:", error);
      toast.error(error.message || "Failed to fetch blogs from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the blog post "${title}"?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to perform this action.");
        return;
      }

      await api.delete(`blogs/${id}`, token);
      toast.success(`Blog post "${title}" deleted successfully.`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (error: any) {
      console.error("Failed to delete blog post:", error);
      toast.error(error.message || "Failed to delete the blog post. Please try again.");
    }
  };

  return (
    <DashboardLayout
      title="My Blogs"
      subtitle="Write articles, share updates, and educate your audience"
      menu={organizerMenu}
    >
      <div className="mb-6 flex justify-end">
        <Link to="/organizer/create-blog">
          <Button className="gradient-primary text-primary-foreground shadow-glow">
            <Plus className="mr-2 h-4 w-4" /> Create Blog Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border border-border/50 bg-card p-5 shadow-card animate-pulse flex flex-col gap-4 sm:flex-row">
              <div className="h-24 w-full rounded-xl bg-muted sm:w-32" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-card flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No Blog Posts Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Publish blog posts to attract more people to your events and keep your community engaged!
            </p>
            <Link to="/organizer/create-blog">
              <Button className="gradient-primary text-primary-foreground shadow-glow">
                <Plus className="mr-2 h-4 w-4" /> Write Your First Post
              </Button>
            </Link>
          </div>
        ) : (
          blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <img src={blog.image} alt={blog.title} loading="lazy" className="h-24 w-full rounded-xl object-cover sm:w-32" />
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        <Tag className="h-3 w-3" />
                        {blog.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {blog.readTime}
                      </span>
                    </div>
                    
                    <Link to={`/blog/${blog.id}`} className="font-display font-semibold text-lg text-foreground hover:text-primary block transition-colors line-clamp-1">
                      {blog.title}
                    </Link>
                    
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/organizer/edit-blog/${blog.id}`}>
                      <Button size="sm" variant="secondary">
                        <Edit className="mr-1.5 h-3.5 w-3.5" />Edit
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(String(blog.id), blog.title)}>
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerBlogs;
