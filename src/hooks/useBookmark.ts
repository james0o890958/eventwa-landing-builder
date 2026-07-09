import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Event } from "@/data/mockEvents";


export function useSavedEvents() {
  return useQuery<Event[]>({
    queryKey: ["saved-events"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return [];
      const res = await api.get("user-saved-events", undefined, token);
      
      const rawEvents = res.events || [];
      return rawEvents.map((be: any) => ({
        id: be.id.toString(),
        title: be.title || be.name || "Untitled event",
        description: be.description || "",
        date: be.start_date || be.date || "",
        time: be.start_date
          ? new Date(be.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : be.time || "",
        location: be.location
          ? (be.location.name || be.location.city || be.location.address || 'Unknown')
          : 'Unknown',
        image: be.image_url || be.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: parseFloat(be.price) || 0,
        organizer: be.organizer ? (be.organizer.name || be.organizer) : 'Unknown',
        attendees: be.capacity || be.attendees || 0,
        category: be.category
          ? (typeof be.category === "string" ? be.category.toLowerCase() : be.category.name?.toLowerCase())
          : 'other',
      })) as Event[];
    },
    enabled: !!localStorage.getItem("access_token"),
  });
}

export function useBookmark(eventId: string, eventData?: any) {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("access_token");

  const { data: savedEvents = [] } = useSavedEvents();
  const saved = savedEvents.some((e) => String(e.id) === String(eventId));

  const toggleMutation = useMutation({
    mutationFn: async (wasSaved: boolean) => {
      if (!token) {
        throw new Error("You must be logged in to bookmark events.");
      }

      if (wasSaved) {
        return api.delete(`user-events/${eventId}/save`, token);
      } else {
        return api.post(`user-events/${eventId}/save`, {}, token);
      }
    },
    onMutate: async (wasSaved: boolean) => {
      // Cancel outstanding refetches
      await queryClient.cancelQueries({ queryKey: ["saved-events"] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData<Event[]>(["saved-events"]) || [];

      // Optimistically update
      let newEvents;
      if (wasSaved) {
        newEvents = previousEvents.filter((e) => String(e.id) !== String(eventId));
      } else {
        const newEvent = eventData || { id: eventId, title: "Loading...", image: "" };
        newEvents = [...previousEvents, newEvent];
      }

      queryClient.setQueryData(["saved-events"], newEvents);

      return { previousEvents };
    },
    onError: (err: any, wasSaved: boolean, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["saved-events"], context.previousEvents);
      }
      toast.error(err.message || "Failed to update bookmark");
    },
    onSuccess: (data: any, wasSaved: boolean) => {
      toast.success(wasSaved ? "Event removed from bookmarks" : "Event saved! 🔖");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
    },
  });

  const toggleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!token) {
      toast.error("You must be logged in to bookmark events.");
      return;
    }

    try {
      await toggleMutation.mutateAsync(saved);
    } catch (err) {
      console.error("Mutation failed", err);
    }
  };

  return {
    saved,
    toggleSave,
    isLoading: toggleMutation.isPending,
  };
}
