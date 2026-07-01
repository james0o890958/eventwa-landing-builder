import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
}

export const BlogCard = ({ id, title, excerpt, image, readTime, date }: BlogCardProps) => (
  <Card className="overflow-hidden group hover:shadow-card transition-shadow cursor-pointer">
    <Link to={`/blog/${id}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{readTime} read</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-secondary-foreground/80 line-clamp-2">{excerpt}</p>
      </CardContent>
    </Link>
  </Card>
);
