export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorInitials: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
}

export const mockBlogs: BlogPost[] = [
  {
    id: "b1",
    title: "The Ultimate Guide to Detty December 2026",
    excerpt: "Everything you need to know about Lagos's wildest month — events, parties, and survival tips.",
    content: "December in Lagos is unlike anywhere else on Earth. From beach parties to rooftop soirées, the city transforms into a non-stop celebration. Here's your complete guide to navigating Detty December 2026...\n\nStart by mapping out the major events: Burna Boy Live, Afro Nation, and the legendary Detty December Beach Party. Book accommodation early — hotels fill up fast. And don't forget your dancing shoes!\n\nPro tip: Get your tickets early. The best events sell out weeks in advance. Follow event organizers on social media for early bird deals.",
    author: "Funke Adeyemi",
    authorInitials: "FA",
    date: "2026-03-15",
    readTime: "5 min",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: "b2",
    title: "How Afrobeats Conquered the World Stage",
    excerpt: "From Lagos studios to global arenas — tracing the rise of Nigeria's biggest cultural export.",
    content: "Afrobeats has gone from local Lagos sound to the world's most exciting music genre. Artists like Wizkid, Burna Boy, and Davido have put Nigerian music on the global map...",
    author: "Chidi Nwosu",
    authorInitials: "CN",
    date: "2026-03-10",
    readTime: "8 min",
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: "b3",
    title: "5 Cultural Festivals You Can't Miss in 2026",
    excerpt: "From Calabar to Osogbo — the festivals that define Nigeria's rich cultural heritage.",
    content: "Nigeria's cultural festivals are among the most vibrant in the world. Here are five you absolutely must attend this year...",
    author: "Amara Okafor",
    authorInitials: "AO",
    date: "2026-02-28",
    readTime: "6 min",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=400&fit=crop",
  },
  {
    id: "b4",
    title: "Lagos Tech Scene: Where Innovation Meets Nightlife",
    excerpt: "Nigeria's tech ecosystem is booming — and the after-parties are just as legendary.",
    content: "Yaba has earned its nickname as 'Yabacon Valley' for good reason. The intersection of tech conferences and Lagos nightlife creates a unique ecosystem...",
    author: "Tunde Bakare",
    authorInitials: "TB",
    date: "2026-02-20",
    readTime: "4 min",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop",
  },
  {
    id: "b5",
    title: "The Rise of Owambe Culture in Modern Nigeria",
    excerpt: "How traditional Nigerian parties became the hottest social events of the year.",
    content: "Owambe parties have evolved from traditional celebrations to Instagram-worthy social events. The fashion, the food, the music — everything is elevated...",
    author: "Yewande Adeyemi",
    authorInitials: "YA",
    date: "2026-02-10",
    readTime: "5 min",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1529543544282-ea3407407e48?w=800&h=400&fit=crop",
  },
  {
    id: "b6",
    title: "A Foodie's Guide to Nigerian Event Catering",
    excerpt: "From jollof rice to suya — the must-have dishes at every Nigerian event.",
    content: "No Nigerian event is complete without incredible food. Whether it's a wedding owambe or a tech conference, the catering can make or break the experience...",
    author: "Ngozi Okeke",
    authorInitials: "NO",
    date: "2026-01-25",
    readTime: "7 min",
    category: "Food",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop",
  },
];
