import { BlogCard } from "@/components/BlogCard";

interface EventBlogSectionProps {
  category?: string;
  blogs?: any[];
}

export const EventBlogSection = ({ category, blogs = [] }: EventBlogSectionProps) => {
  const relatedPosts = blogs;

  if (relatedPosts.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
        <p className="text-muted-foreground">No related blog posts yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {relatedPosts.map((post) => (
        <BlogCard
          key={post.id}
          id={String(post.id)}
          title={post.title}
          excerpt={post.excerpt || post.content?.substring(0, 100) || ""}
          image={post.image || post.thumbnail || "/images/placeholder-blog.jpg"}
          readTime={post.read_time || "5 min read"}
          date={new Date(post.created_at).toLocaleDateString()}
        />
      ))}
    </div>
  );
};
