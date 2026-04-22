import { mockBlogs } from "@/data/mockBlogs";
import { BlogCard } from "@/components/BlogCard";

interface EventBlogSectionProps {
  category: string;
}

export const EventBlogSection = ({ category }: EventBlogSectionProps) => {
  const relatedPosts = mockBlogs.filter(
    (blog) => blog.category.toLowerCase() === category.toLowerCase()
  );

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
          id={post.id}
          title={post.title}
          excerpt={post.excerpt}
          image={post.image}
          readTime={post.readTime}
          date={post.date}
        />
      ))}
    </div>
  );
};
