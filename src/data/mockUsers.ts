export interface MockUser {
  id: string;
  name: string;
  initials: string;
  bio: string;
  location: string;
  avatar?: string;
  joinedEvents: string[];
  purchasedTickets: string[]; // event IDs where user has purchased tickets
}

export interface MockConversation {
  id: string;
  userId: string;
  messages: MockMessage[];
}

export interface MockMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export const currentUserId = "current-user";

export const mockUsers: MockUser[] = [
  { id: "u1", name: "Adaeze Obi", initials: "AO", bio: "Music lover & event enthusiast", location: "Lagos, Nigeria", avatar: "https://i.pravatar.cc/150?u=u1", joinedEvents: ["1", "2", "5"], purchasedTickets: ["1", "2", "5"] },
  { id: "u2", name: "Chidi Nwosu", initials: "CN", bio: "Lagos nightlife explorer", location: "Lekki, Lagos", avatar: "https://i.pravatar.cc/150?u=u2", joinedEvents: ["1", "3", "6"], purchasedTickets: ["1", "3", "6"] },
  { id: "u3", name: "Fatima Bello", initials: "FB", bio: "Tech meets culture", location: "Abuja, FCT", avatar: "https://i.pravatar.cc/150?u=u3", joinedEvents: ["2", "4", "7"], purchasedTickets: ["2", "4", "7"] },
  { id: "u4", name: "Emeka Eze", initials: "EE", bio: "Football fanatic", location: "Enugu, Nigeria", avatar: "https://i.pravatar.cc/150?u=u4", joinedEvents: ["3", "5", "8"], purchasedTickets: ["3", "5", "8"] },
  { id: "u5", name: "Yewande Adeyemi", initials: "YA", bio: "Festival queen 🎉", location: "Ibadan, Oyo", avatar: "https://i.pravatar.cc/150?u=u5", joinedEvents: ["1", "4", "9"], purchasedTickets: ["1", "4", "9"] },
  { id: "u6", name: "Tunde Bakare", initials: "TB", bio: "Afrobeats is life", location: "Lagos, Nigeria", avatar: "https://i.pravatar.cc/150?u=u6", joinedEvents: ["2", "6", "10"], purchasedTickets: ["2", "6", "10"] },
  { id: "u7", name: "Ngozi Okeke", initials: "NO", bio: "Nollywood superfan", location: "Asaba, Delta", avatar: "https://i.pravatar.cc/150?u=u7", joinedEvents: ["5", "7", "11"], purchasedTickets: ["5", "7", "11"] },
  { id: "u8", name: "Ibrahim Yusuf", initials: "IY", bio: "Exploring every corner of Naija", location: "Kano, Nigeria", avatar: "https://i.pravatar.cc/150?u=u8", joinedEvents: ["3", "8", "12"], purchasedTickets: ["3", "8", "12"] },
];

export const mockConversations: MockConversation[] = [
  {
    id: "conv1",
    userId: "u1",
    messages: [
      { id: "m1", senderId: "u1", text: "Hey! Are you going to the Wizkid concert?", timestamp: "2025-07-10T14:30:00" },
      { id: "m2", senderId: currentUserId, text: "Yes! Already got my tickets 🎶", timestamp: "2025-07-10T14:32:00" },
      { id: "m3", senderId: "u1", text: "Amazing! We should link up there", timestamp: "2025-07-10T14:35:00" },
    ],
  },
  {
    id: "conv2",
    userId: "u2",
    messages: [
      { id: "m4", senderId: "u2", text: "Did you see the lineup for Felabration?", timestamp: "2025-07-09T10:00:00" },
      { id: "m5", senderId: currentUserId, text: "Not yet, is it out?", timestamp: "2025-07-09T10:05:00" },
      { id: "m6", senderId: "u2", text: "Just dropped! It's insane 🔥", timestamp: "2025-07-09T10:06:00" },
    ],
  },
  {
    id: "conv3",
    userId: "u5",
    messages: [
      { id: "m7", senderId: "u5", text: "The Calabar Festival is going to be epic this year!", timestamp: "2025-07-08T18:00:00" },
      { id: "m8", senderId: currentUserId, text: "I've never been, worth the trip?", timestamp: "2025-07-08T18:10:00" },
      { id: "m9", senderId: "u5", text: "100%! The carnival parade alone is worth it", timestamp: "2025-07-08T18:12:00" },
    ],
  },
];
