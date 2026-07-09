import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type SavedBlog = {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date?: string;
  author?: string;
  readTime?: string;
  category?: string;
};

// CHANGED: helper to get token and organizer status
function getAuthMeta() {
  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");
  let isOrganizer = false;
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      isOrganizer = !!u.is_organizer || !!u.organizer || !!u.user_metadata?.is_organizer;
    } catch {}
  }
  return { token, isOrganizer };
}

export function useSavedBlogs() {
  const { token, isOrganizer } = getAuthMeta();

  return useQuery<SavedBlog[]>({
    queryKey: ["saved-blogs"],
    queryFn: async () => {
      if (!token) return [];

      // CHANGED: correct endpoint based on user type
      const endpoint = isOrganizer ? "organizer/saved-blogs" : "user/saved-blogs";
      const res = await api.get(endpoint, undefined, token);

      const rawBlogs = res.blogs || res.data || res || [];
      const arr = Array.isArray(rawBlogs) ? rawBlogs : [];

      return arr.map((b: any) => ({
        id: String(b.id),
        title: b.title || "Untitled Post",
        excerpt: b.excerpt || b.content?.substring(0, 150) || "",
        content: b.content || "",
        image: b.image || b.image_url || "",
        date: b.date || b.created_at?.split("T")[0] || "",
        author: b.author?.name || b.author || "Organizer",
        readTime: b.readTime || b.read_time || "3 min",
        category: b.category || "General",
      }));
    },
    enabled: !!token,
  });
}

export function useBlogBookmark(blogId: string, blogData?: any) {
  const queryClient = useQueryClient();
  const { token, isOrganizer } = getAuthMeta();

  const { data: savedBlogs = [] } = useSavedBlogs();
  const saved = savedBlogs.some((b) => String(b.id) === String(blogId));

  const toggleMutation = useMutation({
    mutationFn: async (wasSaved: boolean) => {
      if (!token) throw new Error("You must be logged in to save blogs.");

      // CHANGED: correct endpoint + always POST (toggle on backend)
      const endpoint = isOrganizer
        ? `organizer/blogs/${blogId}/save`
        : `user/blogs/${blogId}/save`;

      return api.post(endpoint, {}, token);
    },
    onMutate: async (wasSaved: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["saved-blogs"] });
      const previous = queryClient.getQueryData<SavedBlog[]>(["saved-blogs"]) || [];

      const next: SavedBlog[] = wasSaved
        ? previous.filter((b) => String(b.id) !== String(blogId))
        : [...previous, blogData || { id: String(blogId), title: "Loading..." }];

      queryClient.setQueryData(["saved-blogs"], next);
      return { previous };
    },
    onError: (err: any, wasSaved: boolean, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["saved-blogs"], ctx.previous);
      toast.error(err?.message || "Failed to update blog bookmark");
    },
    onSuccess: (data: any, wasSaved: boolean) => {
      toast.success(wasSaved ? "Blog unsaved! 🗑️" : "Blog saved! 📖");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-blogs"] });
    },
  });

  const toggleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!token) {
      toast.error("You must be logged in to save blogs.");
      return;
    }
    try {
      await toggleMutation.mutateAsync(saved);
    } catch (err) {
      console.error("Blog bookmark mutation failed", err);
    }
  };

  return { saved, toggleSave, isLoading: toggleMutation.isPending };
}

