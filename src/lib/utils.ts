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
 * Converts Persian (۰-۹) and Arabic-Indic (٠-٩) digits to ASCII English digits (0-9).
 */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 48)
    )
    .replace(/[\u0660-\u0669]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x0660 + 48)
    );
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
