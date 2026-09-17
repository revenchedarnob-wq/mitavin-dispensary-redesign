import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names safely with tailwind-merge and clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Bangladeshi Taka (৳)
 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}
