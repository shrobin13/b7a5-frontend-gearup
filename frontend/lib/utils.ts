import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Backend sometimes sends `category` as a plain string, and sometimes as a
 * populated object ({ id, name, description, createdAt, updatedAt }). This
 * normalizes either shape into a safe display string so it's never rendered
 * as a raw object (which crashes React).
 */
export function getCategoryName(category: unknown, fallback = "Uncategorized"): string {
  if (typeof category === "string" && category.trim()) {
    return category.trim();
  }

  if (category && typeof category === "object" && "name" in category) {
    const name = (category as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }
  }

  return fallback;
}