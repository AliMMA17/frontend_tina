import { env, resolveMediaUrl } from "@/lib/env";

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "figure",
  "figcaption",
  "img",
  "hr",
  "span",
]);

const STRIP_WITH_CONTENT_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "svg",
  "math",
]);

const ALIGN_VALUES = new Set(["right", "center", "left", "justify"]);
const HTML_TAG_DETECT_RE =
  /<\/?(?:p|div|h[1-4]|strong|b|em|i|u|s|blockquote|ul|ol|li|a|figure|img|br|hr|span)\b[^>]*>/i;
const LEGACY_IMAGE_LINE_RE = /(!\[[^\]]*\]\([^\s)]+\))/g;
const LEGACY_IMAGE_CAPTURE_RE = /^!\[([^\]]*)\]\(([^\s)]+)\)$/;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  );
}

function isSafeImageUrl(src: string): boolean {
  const trimmed = src.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/uploads/")
  );
}

/**
 * Converts legacy plain-text / markdown-image content into clean HTML blocks.
 */
function legacyTextToHtml(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const parts = trimmed.split(LEGACY_IMAGE_LINE_RE);
  const blocks: string[] = [];

  for (const part of parts) {
    const imgMatch = LEGACY_IMAGE_CAPTURE_RE.exec(part);
    if (imgMatch) {
      const alt = escapeHtml(imgMatch[1]?.trim() || "تصویر مقاله");
      const src = imgMatch[2]?.trim() || "";
      if (isSafeImageUrl(src)) {
        blocks.push(
          `<figure><img src="${escapeHtml(src)}" alt="${alt}" /></figure>`
        );
      } else {
        blocks.push(`<p>${escapeHtml(part)}</p>`);
      }
      continue;
    }

    const paragraphs = part
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    for (const para of paragraphs) {
      blocks.push(`<p>${escapeHtml(para).replaceAll("\n", "<br />")}</p>`);
    }
  }

  return blocks.join("");
}

function sanitizeElement(
  sourceEl: Element,
  doc: Document,
  resolveImages: boolean
): Node | null {
  const tag = sourceEl.tagName.toLowerCase();

  if (STRIP_WITH_CONTENT_TAGS.has(tag)) {
    return null;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    const fragment = doc.createDocumentFragment();
    for (const child of Array.from(sourceEl.childNodes)) {
      const sanitizedChild = sanitizeNode(child, doc, resolveImages);
      if (sanitizedChild) fragment.appendChild(sanitizedChild);
    }
    return fragment;
  }

  const cleanEl = doc.createElement(tag);

  if (tag === "a") {
    const href = sourceEl.getAttribute("href") || "";
    if (isSafeHref(href)) {
      cleanEl.setAttribute("href", href.trim());
      cleanEl.setAttribute("target", "_blank");
      cleanEl.setAttribute("rel", "noopener noreferrer");
    }
  } else if (tag === "img") {
    const rawSrc = (sourceEl.getAttribute("src") || "").trim();
    if (!isSafeImageUrl(rawSrc)) {
      return null;
    }
    const baseUploadsPrefix = `${env.apiBaseUrl}/uploads/`;
    const finalSrc = resolveImages
      ? resolveMediaUrl(rawSrc) || rawSrc
      : rawSrc.startsWith(baseUploadsPrefix)
      ? rawSrc.slice(env.apiBaseUrl.length)
      : rawSrc;
    cleanEl.setAttribute("src", finalSrc);
    const alt = sourceEl.getAttribute("alt")?.trim() || "تصویر مقاله";
    cleanEl.setAttribute("alt", alt);
  } else {
    const textAlign =
      (sourceEl as HTMLElement).style?.textAlign?.toLowerCase() ||
      sourceEl.getAttribute("align")?.toLowerCase() ||
      "";
    if (ALIGN_VALUES.has(textAlign)) {
      cleanEl.style.textAlign = textAlign;
    }
  }

  for (const child of Array.from(sourceEl.childNodes)) {
    const sanitizedChild = sanitizeNode(child, doc, resolveImages);
    if (sanitizedChild) cleanEl.appendChild(sanitizedChild);
  }

  return cleanEl;
}

function sanitizeNode(
  node: Node,
  doc: Document,
  resolveImages: boolean
): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent || "");
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return sanitizeElement(node as Element, doc, resolveImages);
  }
  return null;
}

/**
 * Sanitizes rich HTML using a strict DOM allowlist.
 * Set resolveImages=true when displaying in the browser (prepends API base to /uploads/...).
 * Set resolveImages=false when saving to the backend so /uploads/... stays domain-independent.
 */
export function sanitizeBlogHtml(
  rawHtml: string,
  options: { resolveImages?: boolean } = {}
): string {
  const { resolveImages = true } = options;
  if (!rawHtml.trim()) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return rawHtml;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(rawHtml, "text/html");
  const outDoc = document.implementation.createHTMLDocument("");
  const container = outDoc.createElement("div");

  for (const child of Array.from(parsed.body.childNodes)) {
    const clean = sanitizeNode(child, outDoc, resolveImages);
    if (clean) container.appendChild(clean);
  }

  return container.innerHTML;
}

/**
 * Normalizes stored blog content (HTML or legacy plain text) into safe HTML.
 */
export function normalizeBlogContentToHtml(
  rawContent: string,
  options: { resolveImages?: boolean } = {}
): string {
  if (!rawContent.trim()) return "";
  if (HTML_TAG_DETECT_RE.test(rawContent)) {
    return sanitizeBlogHtml(rawContent, options);
  }
  const converted = legacyTextToHtml(rawContent);
  return sanitizeBlogHtml(converted, options);
}

/**
 * Converts HTML/legacy blog content into plain text for card summaries.
 */
export function stripHtmlToText(rawContent: string): string {
  if (!rawContent.trim()) return "";
  if (!HTML_TAG_DETECT_RE.test(rawContent)) {
    return rawContent
      .replace(/!\[[^\]]*\]\([^\s)]+\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(rawContent, "text/html");
    return (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
  }

  return rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Checks whether HTML content contains visible text or at least one image.
 */
export function hasMeaningfulHtmlContent(rawContent: string): boolean {
  if (!rawContent.trim()) return false;
  if (/<img\b/i.test(rawContent) || /!\[[^\]]*\]\([^\s)]+\)/.test(rawContent)) {
    return true;
  }
  return stripHtmlToText(rawContent).length > 0;
}
