import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar, Send, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockBlogs } from "@/data/mockBlogs";
import { mockEvents } from "@/data/mockEvents";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import OrganizerLink from "@/components/OrganizerLink";
import { isOrganizer } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  date: string;
  likes: number;
}

const BlogPost = () => {
  const { id } = useParams();
  const post = mockBlogs.find((b) => b.id === id);
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Chidi Okafor",
      authorInitials: "CO",
      content: "This is such an insightful article! I've been to several of these events and can confirm they're absolutely worth attending.",
      date: "2026-03-16",
      likes: 12,
    },
    {
      id: "c2",
      author: "Amara Johnson",
      authorInitials: "AJ",
      content: "Great write-up! Would love to see more coverage on the underground music scene in Lagos.",
      date: "2026-03-17",
      likes: 8,
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [savedPosts, setSavedPosts] = useState<string[]>(JSON.parse(localStorage.getItem('savedPosts') || '[]'));

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Post Not Found</h1>
            <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">Back to Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  const isSaved = savedPosts.includes(post.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-24 relative z-10 max-w-3xl mx-auto"
        >
          <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

          <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-semibold text-primary">
            {post.category}
          </span>

          <h1 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>

          <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {isOrganizer(post.author) ? (
                <OrganizerLink
                  organizerName={post.author}
                  className="hover:text-primary transition-colors"
                />
              ) : (
                post.author
              )}
            </span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{post.readTime} read</span>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
            <p className="text-lg leading-relaxed text-secondary-foreground/80 whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Social Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
                <span>24</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length} comments</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error("Please sign in to save posts");
                    return;
                  }
                  const newSaved = isSaved ? savedPosts.filter(id => id !== post.id) : [...savedPosts, post.id];
                  setSavedPosts(newSaved);
                  localStorage.setItem('savedPosts', JSON.stringify(newSaved));
                  toast.success(isSaved ? "Post unsaved" : "Post saved");
                }}
                className={`flex items-center gap-2 transition-colors ${isSaved ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Bookmark className="h-5 w-5" />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Leave a comment</h3>
            {user ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-secondary border-border/50"
                />
                <Button 
                  onClick={() => {
                    if (!newComment.trim()) {
                      toast.error("Please enter a comment");
                      return;
                    }
                    const comment: Comment = {
                      id: `c${Date.now()}`,
                      author: user.user_metadata?.display_name || "Anonymous",
                      authorInitials: (user.user_metadata?.display_name || "A").charAt(0).toUpperCase(),
                      content: newComment.trim(),
                      date: new Date().toISOString().split("T")[0],
                      likes: 0,
                    };
                    setComments([comment, ...comments]);
                    setNewComment("");
                    toast.success("Comment added!");
                  }}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Sign in to leave a comment</p>
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/50 bg-card p-6"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                      {comment.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-secondary-foreground/80 leading-relaxed">{comment.content}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Related Events Section */}
        <div className="max-w-3xl mx-auto mt-16 mb-12">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Related Events
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockEvents
              .filter((event) => {
                const categoryMap: Record<string, string[]> = {
                  "Music": ["music"],
                  "Culture": ["festivals", "exhibitions"],
                  "Lifestyle": ["social", "festivals", "music"],
                  "Tech": ["conferences"],
                  "Food": ["festivals", "social"],
                };
                const relatedCategories = categoryMap[post.category] || [];
                return relatedCategories.includes(event.category);
              })
              .slice(0, 4)
              .map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {event.category}
                    </span>
                    <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span>{event.location.split(",")[0]}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          {mockEvents.filter((event) => {
            const categoryMap: Record<string, string[]> = {
              "Music": ["music"],
              "Culture": ["festivals", "exhibitions"],
              "Lifestyle": ["social", "festivals", "music"],
              "Tech": ["conferences"],
              "Food": ["festivals", "social"],
            };
            const relatedCategories = categoryMap[post.category] || [];
            return relatedCategories.includes(event.category);
          }).length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No related events found. <Link to="/explore" className="text-primary hover:underline">Explore all events</Link>
            </p>
          )}
        </div>
      </div>

      <div className="mt-16" />
      <Footer />
    </div>
  );
};

export default BlogPost;
