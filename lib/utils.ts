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
/**
 * Resolve the display name of the item(s) on a rental order.
 *
 * The backend returns gear nested under `items[].gearItem`, while some older
 * payloads place it under `gear` — handle both so the fallback placeholder is
 * only used when there really is no item data.
 */
export function getRentalItemName(
  rental:
    | {
        gear?: { name?: string | null } | null;
        items?: Array<{ gearItem?: { name?: string | null } | null }> | null;
      }
    | null
    | undefined,
): string | undefined {
  const namedItem = rental?.items?.find((item) => item.gearItem?.name);
  return namedItem?.gearItem?.name ?? rental?.gear?.name ?? undefined;
}

export function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
): string | null {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} – ${endDate}`;
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return `${start.toLocaleDateString(undefined, options)} – ${end.toLocaleDateString(undefined, options)}`;
}

export function formatMoney(value: number | string | null | undefined): string {
  if (value == null) {
    return "";
  }

  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return numeric.toFixed(2);
}
