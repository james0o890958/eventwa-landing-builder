import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mockEvents } from "@/data/mockEvents";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function organizerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAllOrganizerNames(): string[] {
  const organizerSet = new Set<string>();
  for (const event of mockEvents) {
    organizerSet.add(event.organizer);
  }
  return Array.from(organizerSet);
}

export function isOrganizer(name: string): boolean {
  return getAllOrganizerNames().includes(name);
}
