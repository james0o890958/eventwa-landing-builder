import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Image, FileText, Tag, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface EventItem {
  id: string | number;
  title: string;
  categoryName?: string;
}

const CATEGORIES = ["Music", "Sports", "Movies", "Festivals", "Conferences", "Religious", "Social", "Gaming", "Exhibitions"];

const CreateBlogPost = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize eventId from query parameters
  useEffect(() => {
    const queryEventId = searchParams.get("eventId");
    if (queryEventId) {
      setSelectedEventId(queryEventId);
    }
  }, [searchParams]);

  // Auto-select category when event is selected
  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      const linkedEvent = events.find(evt => evt.id === selectedEventId);
      if (linkedEvent && linkedEvent.categoryName) {
        const matchedCat = CATEGORIES.find(
          (c) => c.toLowerCase() === linkedEvent.categoryName?.toLowerCase()
        );
        if (matchedCat) {
          setCategory(matchedCat);
        }
      }
    }
  }, [selectedEventId, events]);

  // Fetch organizer events and blog detail
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // 1. Fetch events
      try {
        const eventsRes = await api.get("events", undefined, token);
        if (eventsRes && eventsRes.status === "success" && Array.isArray(eventsRes.events)) {
          setEvents(eventsRes.events.map((e: any) => ({
            id: String(e.id),
            title: e.title,
            categoryName: e.category?.name || ""
          })));
        }
      } catch (error) {
        console.error("Failed to load organizer events:", error);
      }

      // 2. Fetch blog detail (if editing)
      if (isEdit) {
        setLoading(true);
        try {
          const res = await api.get(`organizer/blogs/${id}`, undefined, token);
          if (res) {
            const blog = res.blog || res.data || res;
            setTitle(blog.title || "");
            setCategory(blog.category || "");
            setContent(blog.content || "");
            setImageUrl(blog.image || blog.image_url || "");
            if (blog.event_id) {
              setSelectedEventId(String(blog.event_id));
            }
          }
        } catch (error: any) {
          console.error("Failed to load blog post for editing:", error);
          toast.error(error.message || "Failed to load blog details.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Please enter a title");
    if (!category) return toast.error("Please select a category");
    if (!content.trim()) return toast.error("Please enter content");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to perform this action.");
        navigate("/login");
        return;
      }

      // Calculate simple read time based on word count
      const words = content.trim().split(/\s+/).length;
      const readTimeVal = `${Math.max(1, Math.round(words / 200))} min read`;

      const payload = {
        title: title.trim(),
        category: category,
        content: content.trim(),
        image_url: imageUrl.trim() || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
        read_time: readTimeVal,
        excerpt: content.substring(0, 150) + "...",
        event_id: selectedEventId ? Number(selectedEventId) : null,
      };

      if (isEdit) {
        // Backend route: PUT blogs/{id}
        await api.put(`blogs/${id}`, payload, token);
        toast.success("Blog post updated successfully! 🎉");
      } else {
        // Backend route: POST blogs
        await api.post("blogs", payload, token);
        toast.success("Blog post published successfully! 🎉");
      }

      navigate("/organizer/blogs");
    } catch (error: any) {
      console.error("Failed to save blog post:", error);
      toast.error(error.message || "Failed to save blog post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading blog details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Link
          to="/organizer/blogs"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>

        <h1 className="mb-2 font-display text-4xl font-bold text-foreground">
          {isEdit ? "Edit Blog Post" : "Write Blog Post"}
        </h1>
        <p className="mb-10 text-muted-foreground">
          {isEdit
            ? "Make changes to your published article below."
            : "Share stories, guides, and updates with your community."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Article Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. 5 Tips for Planning a Successful Music Festival"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm font-medium text-foreground">
              Category <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eventId" className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Link to Event (Optional)
            </Label>
            <select
              id="eventId"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className={`${inputCls} w-full rounded-md px-3 py-2 text-sm focus-visible:outline-none`}
            >
              <option value="" className="bg-card text-foreground">Select an event (Optional)</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id} className="bg-card text-foreground">
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl" className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Image className="h-4 w-4 text-muted-foreground" />
              Cover Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://images.unsplash.com/... or leave blank for a default placeholder"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputCls}
            />
            {imageUrl && (
              <div className="relative mt-2 h-48 overflow-hidden rounded-xl border border-border/50">
                <img
                  src={imageUrl}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your article details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`${inputCls} min-h-[300px] resize-y leading-relaxed`}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="gradient-primary text-primary-foreground shadow-glow gap-2 disabled:opacity-60 min-w-[140px]"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isEdit ? "Update Post" : "Publish Post"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CreateBlogPost;
