/**
 * Joins truthy class names into a single space-separated string.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a numeric value using locale-aware grouping.
 */
export function formatNumber(
  value: number | string | null | undefined,
  locale = "en-US"
): string {
  if (value == null || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString(locale);
}

/**
 * Formats an ISO string or Date instance for display.
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return String(dateInput);
  return new Intl.DateTimeFormat(locale, options).format(date);
}
