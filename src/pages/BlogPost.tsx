import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, User, Calendar, Send,
  Heart, MessageCircle, Share2, Bookmark, Loader2, Flag
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import OrganizerLink from "@/components/OrganizerLink";
import { isOrganizer } from "@/lib/utils";
import { api } from "@/lib/api";
import ReportDialog from "@/components/ReportDialog";
import { moderateComment } from "@/lib/moderation";
import { useBlogBookmark } from "@/hooks/useSavedBlogs";

// CHANGED: updated Comment interface to match API response
interface Comment {
  id: string | number;
  author: string;
  authorInitials: string;
  content: string;
  date: string;
  is_owner: boolean;
  is_flagged: boolean;
  flag_count: number;
  likes?: number;
  likes_count?: number;
  is_liked?: boolean;
  parent_comment_id?: string | number | null;
  parent_id?: string | number | null;
  replies?: Comment[];
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  content: string;
  image: string;
  author: string;
  authorInitials: string;
  date: string;
  readTime: string;
  event_id?: number | null;
}

const getCommentParentId = (comment: Comment) =>
  comment.parent_comment_id ?? comment.parent_id ?? null;

const flattenComments = (items: Comment[]): Comment[] =>
  items.flatMap((comment) => {
    const { replies = [], ...commentWithoutReplies } = comment;
    const nestedReplies = replies.map((reply) => ({
      ...reply,
      parent_comment_id: getCommentParentId(reply) ?? comment.id,
    }));

    return [commentWithoutReplies, ...flattenComments(nestedReplies)];
  });

const buildCommentTree = (items: Comment[]): Comment[] => {
  const byId = new Map<string, Comment>();
  const roots: Comment[] = [];

  items.forEach((comment) => {
    byId.set(String(comment.id), { ...comment, replies: [] });
  });

  byId.forEach((comment) => {
    const parentId = getCommentParentId(comment);
    const parent = parentId ? byId.get(String(parentId)) : undefined;

    if (parent) {
      parent.replies = [...(parent.replies ?? []), comment];
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

const BlogPost = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedEvent, setLinkedEvent] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postLikes, setPostLikes] = useState<number>(0);
  const [likesLoading, setLikesLoading] = useState<boolean>(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [postingReplyTo, setPostingReplyTo] = useState<string | number | null>(null);
  const [likingCommentIds, setLikingCommentIds] = useState<Set<string>>(new Set());

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  // CHANGED: fetch blog from real API
  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token") || undefined;
        const res = await api.get(`blogs/${id}`, undefined, token);
        const blog = res.blog || res.data || res;

        if (blog) {
          const authorName = blog.author?.name || blog.author || "Organizer";
          setPost({
            id: String(blog.id),
            title: blog.title || "Untitled Post",
            category: blog.category || "General",
            content: blog.content || "",
            image: blog.image || blog.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
            author: authorName,
            authorInitials: authorName.substring(0, 2).toUpperCase(),
            date: blog.date || blog.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            readTime: blog.readTime || blog.read_time || "3 min",
            event_id: blog.event_id || null,
          });

          // CHANGED: fetch linked event if present
          if (blog.event_id) {
            const eventRes = await api.get(`public/events/${blog.event_id}`).catch(() => null);
            if (eventRes) {
              setLinkedEvent(eventRes.event || eventRes.data || eventRes);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
        toast.error("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlogPost();
  }, [id]);

  // CHANGED: bookmark hook called once after post is available
  const { saved: isSaved, toggleSave, isLoading: isBlogSaveLoading } = useBlogBookmark(
    String(post?.id ?? id),
    post
  );

  // CHANGED: fetch post likes + comments
  useEffect(() => {
    const blogId = post?.id ?? id;
    if (!blogId) return;

    const token = localStorage.getItem("access_token") || undefined;

    // Likes (public)
    api
      .get(`blogs/${blogId}/likes`, undefined, token)
      .then((res) => {
        setPostLikes(Number(res.likes_count ?? res.likes ?? 0));
      })
      .catch((err) => { console.error('Failed to fetch likes:', err); });

    // Comments (public)
    api
      .get(`blogs/${blogId}/comments`, undefined, token)
      .then((res) => {
        const arr = res.comments ?? res.data ?? [];
        setComments(Array.isArray(arr) ? flattenComments(arr) : []);
      })
      .catch((err) => { console.error('Failed to fetch comments:', err); });
  }, [post?.id, id]);

  const createOptimisticComment = (content: string, parentCommentId?: string | number | null): Comment => ({
    id: `temp-${Date.now()}`,
    author: user?.user_metadata?.display_name || "You",
    authorInitials: (user?.user_metadata?.display_name || "Y").charAt(0).toUpperCase(),
    content,
    date: new Date().toISOString().split("T")[0],
    likes: 0,
    is_owner: true,
    is_flagged: false,
    flag_count: 0,
    parent_comment_id: parentCommentId ?? null,
  });

  const submitComment = async (content: string, parentCommentId?: string | number | null) => {
    if (!content.trim()) {
      toast.error(parentCommentId ? "Please enter a reply" : "Please enter a comment");
      return false;
    }

    const moderation = moderateComment(content);
    if (moderation.severity === "block") {
      toast.error(moderation.reason || "This comment cannot be posted.");
      return false;
    }
    if (moderation.severity === "warn") {
      toast.warning(moderation.reason || "This comment may be reviewed.");
    }

    const token = localStorage.getItem("access_token") || undefined;
    if (!token) {
      toast.error(parentCommentId ? "Please sign in to reply" : "Please sign in to comment");
      return false;
    }

    const draft = content.trim();
    const optimistic = createOptimisticComment(draft, parentCommentId);
    setComments((prev) => (parentCommentId ? [...prev, optimistic] : [optimistic, ...prev]));

    try {
      const res = await api.post(
        `blogs/${post!.id}/comments`,
        parentCommentId ? { content: draft, parent_comment_id: parentCommentId } : { content: draft },
        token
      );
      const serverComment = res.comment ?? res.data ?? optimistic;
      const created = parentCommentId
        ? { ...serverComment, parent_comment_id: getCommentParentId(serverComment) ?? parentCommentId }
        : serverComment;
      setComments((prev) =>
        prev.map((comment) => (comment.id === optimistic.id ? created : comment))
      );
      toast.success(parentCommentId ? "Reply posted!" : "Comment posted!");
      return true;
    } catch (err: any) {
      setComments((prev) => prev.filter((comment) => comment.id !== optimistic.id));
      toast.error(err.message || (parentCommentId ? "Failed to post reply." : "Failed to post comment."));
      return false;
    }
  };

  const updateCommentById = (
    commentId: string | number,
    updater: (comment: Comment) => Comment
  ) => {
    setComments((prev) =>
      prev.map((comment) => (String(comment.id) === String(commentId) ? updater(comment) : comment))
    );
  };

  const toggleCommentLike = async (comment: Comment) => {
    if (!user) {
      toast.error("Please sign in to like comments");
      return;
    }

    const token = localStorage.getItem("access_token") || undefined;
    if (!token || !post) {
      toast.error("Please sign in to like comments");
      return;
    }

    const commentId = String(comment.id);
    if (commentId.startsWith("temp-") || likingCommentIds.has(commentId)) return;

    const wasLiked = Boolean(comment.is_liked);
    const previousLikes = Number(comment.likes_count ?? comment.likes ?? 0);
    const optimisticLikes = Math.max(0, previousLikes + (wasLiked ? -1 : 1));

    setLikingCommentIds((prev) => new Set(prev).add(commentId));
    updateCommentById(comment.id, (item) => ({
      ...item,
      is_liked: !wasLiked,
      likes: optimisticLikes,
      likes_count: optimisticLikes,
    }));

    try {
      const res = await api.post(
        `blogs/${post.id}/comments/${comment.id}/likes`,
        {},
        token
      );
      const likesCount = Number(res.likes_count ?? res.likes ?? optimisticLikes);
      updateCommentById(comment.id, (item) => ({
        ...item,
        is_liked: Boolean(res.is_liked ?? res.liked ?? !wasLiked),
        likes: likesCount,
        likes_count: likesCount,
      }));
    } catch (err: any) {
      updateCommentById(comment.id, (item) => ({
        ...item,
        is_liked: wasLiked,
        likes: previousLikes,
        likes_count: previousLikes,
      }));
      toast.error(err.message || "Failed to update comment like");
    } finally {
      setLikingCommentIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const commentId = String(comment.id);
    const isReplying = replyingTo === comment.id;
    const replyDraft = replyDrafts[commentId] ?? "";
    const commentLikes = Number(comment.likes_count ?? comment.likes ?? 0);
    const isLikingComment = likingCommentIds.has(commentId);

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={depth === 0 ? "rounded-xl border border-border/50 bg-card p-6" : "border-l border-border/60 pl-4"}
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
                {new Date(comment.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            {comment.is_flagged ? (
              <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                This comment has been flagged and is under review.
              </div>
            ) : (
              <p className="text-secondary-foreground/80 leading-relaxed">{comment.content}</p>
            )}
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() => toggleCommentLike(comment)}
                disabled={isLikingComment || commentId.startsWith("temp-")}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.is_liked ? "text-primary" : "text-muted-foreground hover:text-primary"
                } ${isLikingComment ? "opacity-70" : ""}`}
              >
                <Heart className={`h-4 w-4 ${comment.is_liked ? "fill-primary" : ""}`} />
                <span>{commentLikes}</span>
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error("Please sign in to reply");
                    return;
                  }
                  setReplyingTo(isReplying ? null : comment.id);
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Reply
              </button>
              {!comment.is_owner && !comment.is_flagged && post && (
                <ReportDialog
                  targetType="comment"
                  targetId={comment.id}
                  blogId={post.id}
                  targetName={comment.author}
                  commentContent={comment.content}
                  onReported={() =>
                    setComments((prev) =>
                      prev.map((item) =>
                        item.id === comment.id
                          ? { ...item, is_flagged: true, flag_count: (item.flag_count || 0) + 1 }
                          : item
                      )
                    )
                  }
                >
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
                    <Flag className="h-4 w-4" />
                    Report
                  </button>
                </ReportDialog>
              )}
            </div>

            {isReplying && (
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder={`Reply to ${comment.author}...`}
                  value={replyDraft}
                  onChange={(event) =>
                    setReplyDrafts((prev) => ({ ...prev, [commentId]: event.target.value }))
                  }
                  className="min-h-[88px] bg-secondary border-border/50"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      setPostingReplyTo(comment.id);
                      const posted = await submitComment(replyDraft, comment.id);
                      if (posted) {
                        setReplyDrafts((prev) => ({ ...prev, [commentId]: "" }));
                        setReplyingTo(null);
                      }
                      setPostingReplyTo(null);
                    }}
                    disabled={postingReplyTo === comment.id}
                    size="sm"
                    className="gap-2"
                  >
                    {postingReplyTo === comment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post Reply
                  </Button>
                  <Button onClick={() => setReplyingTo(null)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {(comment.replies ?? []).length > 0 && (
              <div className="mt-5 space-y-5">
                {comment.replies!.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm font-medium">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <OrganizerLink organizerName={post.author} className="hover:text-primary transition-colors" />
              ) : (
                post.author
              )}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {post.readTime} read
            </span>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
            <p className="text-lg leading-relaxed text-secondary-foreground/80 whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* CHANGED: linked event section */}
          {linkedEvent && (
            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={linkedEvent.image || linkedEvent.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                  alt={linkedEvent.title}
                  className="h-16 w-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Featured Event</span>
                  <h4 className="font-display font-bold text-foreground text-lg">{linkedEvent.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(linkedEvent.start_date || linkedEvent.date || "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <Link to={`/event/${linkedEvent.id}`}>
                <Button className="gradient-primary text-primary-foreground shadow-glow whitespace-nowrap">
                  Get Tickets
                </Button>
              </Link>
            </div>
          )}

          {/* Social Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (!user) {
                    toast.error("Please sign in to like posts");
                    return;
                  }
                  if (!post) return;
                  const token = localStorage.getItem("access_token") || undefined;
                  if (!token) {
                    toast.error("Please sign in to like posts");
                    return;
                  }
                  setLikesLoading(true);
                  api
                    .post(`blogs/${post.id}/likes`, {}, token)
                    .then((res) => {
                      setPostLikes(Number(res.likes_count ?? 0));
                    })
                    .catch(() => {
                      toast.error("Failed to update like");
                    })
                    .finally(() => setLikesLoading(false));
                }}
                disabled={likesLoading}
                className={`flex items-center gap-2 transition-colors ${
                  likesLoading ? "text-muted-foreground" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Heart className={`h-5 w-5 ${likesLoading ? "" : ""}`} />
                <span>{postLikes}</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length} comments</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
              {/* CHANGED: save button wired to real API via useBlogBookmark */}
              <button
                onClick={(e) => {
                  if (!user) {
                    toast.error("Please sign in to save posts");
                    return;
                  }
                  toggleSave(e);
                }}
                disabled={isBlogSaveLoading}
                className={`flex items-center gap-2 transition-colors ${
                  isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
                <span>{isBlogSaveLoading ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Comments ({comments.length})
          </h2>

          <div className="rounded-2xl border border-border/50 bg-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Leave a comment</h3>
            <div className="rounded-2xl border border-border/50 bg-secondary/60 p-4 mb-4 text-sm text-muted-foreground">
              Please follow Eventwa’s Community Standards when sharing your thoughts. Comments that violate these standards may be flagged, removed, and you will receive a notification if your comment is marked for review. <Link to="/community-standards" className="text-primary hover:underline">Read the full policy.</Link>
            </div>
            {user ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-secondary border-border/50"
                />
                <Button
                  onClick={async () => {
                    const draft = newComment.trim();
                    const posted = await submitComment(draft);
                    if (posted) {
                      setNewComment("");
                    }
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
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {commentTree.map((comment) => renderComment(comment))}
          </div>
        </div>
      </div>

      <div className="mt-16" />
      <Footer />
    </div>
  );
};

export default BlogPost;
