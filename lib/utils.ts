import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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