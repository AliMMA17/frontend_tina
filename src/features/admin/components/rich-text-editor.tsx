"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
} from "lucide-react";
import { uploadBlogImage } from "@/features/blogs/services/blogs.service";
import { normalizeBlogContentToHtml } from "@/features/blogs/utils/rich-content";
import { resolveMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  initialValue: string;
  editorKey: string;
  disabled?: boolean;
  onChange: (html: string) => void;
  onError?: (message: string | null) => void;
}

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  block: string;
}

const DEFAULT_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  unorderedList: false,
  orderedList: false,
  block: "p",
};

export function RichTextEditor({
  initialValue,
  editorKey,
  disabled = false,
  onChange,
  onError,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [formats, setFormats] = useState<ActiveFormats>(DEFAULT_FORMATS);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEmpty, setIsEmpty] = useState(() => !initialValue.trim());

  const syncContent = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    const hasText = (el.textContent || "").trim().length > 0;
    const hasImg = el.querySelector("img") !== null;
    setIsEmpty(!hasText && !hasImg);
    onChange(html);
  }, [onChange]);

  const updateToolbarState = useCallback(() => {
    if (typeof document === "undefined") return;
    try {
      const rawBlock = (
        document.queryCommandValue("formatBlock") || "p"
      ).toLowerCase();
      setFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        unorderedList: document.queryCommandState("insertUnorderedList"),
        orderedList: document.queryCommandState("insertOrderedList"),
        block: rawBlock.replace(/[<>]/g, ""),
      });
    } catch {
      // Ignore queryCommandState errors when selection is outside the editor
    }
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    const el = editorRef.current;
    if (!sel || sel.rangeCount === 0 || !el) return;
    const range = sel.getRangeAt(0);
    if (el.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
    updateToolbarState();
  }, [updateToolbarState]);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    } else {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = normalizeBlogContentToHtml(initialValue, {
      resolveImages: true,
    });
    el.innerHTML = html;
    const hasText = (el.textContent || "").trim().length > 0;
    const hasImg = el.querySelector("img") !== null;
    setIsEmpty(!hasText && !hasImg);
    savedRangeRef.current = null;
    setLinkPopoverOpen(false);
    setLinkUrl("");
  }, [editorKey, initialValue]);

  const execCommand = (command: string, value?: string) => {
    if (disabled || uploadingImage) return;
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    syncContent();
  };

  const applyBlockTag = (tag: "p" | "h2" | "h3" | "blockquote") => {
    if (disabled || uploadingImage) return;
    restoreSelection();
    document.execCommand("formatBlock", false, `<${tag}>`);
    saveSelection();
    syncContent();
  };

  const handleOpenLinkPopover = () => {
    saveSelection();
    setLinkPopoverOpen((prev) => !prev);
  };

  const handleApplyLink = () => {
    const trimmed = linkUrl.trim();
    if (!trimmed) {
      setLinkPopoverOpen(false);
      return;
    }
    const safeUrl =
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/")
        ? trimmed
        : `https://${trimmed}`;

    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      const anchor = document.createElement("a");
      anchor.href = safeUrl;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = safeUrl;
      const range = sel.getRangeAt(0);
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      document.execCommand("createLink", false, safeUrl);
    }

    setLinkUrl("");
    setLinkPopoverOpen(false);
    saveSelection();
    syncContent();
  };

  const handleImagePick = () => {
    if (disabled || uploadingImage) return;
    saveSelection();
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      onError?.(null);
      setUploadingImage(true);
      const uploaded = await uploadBlogImage(file);
      const displaySrc = resolveMediaUrl(uploaded.url) || uploaded.url;

      restoreSelection();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = displaySrc;
        img.alt = file.name.replace(/\.[^.]+$/, "") || "تصویر مقاله";
        figure.appendChild(img);

        const trailingPara = document.createElement("p");
        trailingPara.appendChild(document.createElement("br"));

        range.insertNode(trailingPara);
        range.insertNode(figure);

        const nextRange = document.createRange();
        nextRange.setStart(trailingPara, 0);
        nextRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(nextRange);
        savedRangeRef.current = nextRange.cloneRange();
      } else if (editorRef.current) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = displaySrc;
        img.alt = "تصویر مقاله";
        figure.appendChild(img);
        editorRef.current.appendChild(figure);
      }

      syncContent();
    } catch (err: unknown) {
      onError?.(
        err instanceof Error ? err.message : "آپلود تصویر با خطا مواجه شد."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const toolbarBtnClass = (active = false) =>
    cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-45",
      active
        ? "bg-brand-green text-brand-gold shadow-xs"
        : "text-brand-navy hover:bg-brand-iceLight"
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white focus-within:border-brand-green transition-colors">
      {/* Interactive Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200/80 bg-brand-cream/70 px-2.5 py-2">
        {/* Block Formats */}
        <button
          type="button"
          title="متن عادی"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyBlockTag("p")}
          className={toolbarBtnClass(formats.block === "p" || formats.block === "div")}
        >
          <Pilcrow className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="تیتر بزرگ"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyBlockTag("h2")}
          className={toolbarBtnClass(formats.block === "h2")}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="تیتر کوچک"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyBlockTag("h3")}
          className={toolbarBtnClass(formats.block === "h3")}
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="نقل‌قول"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyBlockTag("blockquote")}
          className={toolbarBtnClass(formats.block === "blockquote")}
        >
          <Quote className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />

        {/* Text Styles */}
        <button
          type="button"
          title="بولد (Ctrl+B)"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("bold")}
          className={toolbarBtnClass(formats.bold)}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="ایتالیک (Ctrl+I)"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("italic")}
          className={toolbarBtnClass(formats.italic)}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="زیرخط (Ctrl+U)"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("underline")}
          className={toolbarBtnClass(formats.underline)}
        >
          <Underline className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />

        {/* Lists */}
        <button
          type="button"
          title="لیست نقطه‌ای"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("insertUnorderedList")}
          className={toolbarBtnClass(formats.unorderedList)}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="لیست شماره‌دار"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("insertOrderedList")}
          className={toolbarBtnClass(formats.orderedList)}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />

        {/* Alignment */}
        <button
          type="button"
          title="چیدمان راست"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyRight")}
          className={toolbarBtnClass(false)}
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="وسط‌چین"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyCenter")}
          className={toolbarBtnClass(false)}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="چیدمان چپ"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyLeft")}
          className={toolbarBtnClass(false)}
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />

        {/* Link & Clear & Undo/Redo */}
        <button
          type="button"
          title="افزودن لینک"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleOpenLinkPopover}
          className={toolbarBtnClass(linkPopoverOpen)}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="حذف فرمت متن انتخاب‌شده"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("removeFormat")}
          className={toolbarBtnClass(false)}
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="بازگشت (Undo)"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("undo")}
          className={toolbarBtnClass(false)}
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="انجام مجدد (Redo)"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("redo")}
          className={toolbarBtnClass(false)}
        >
          <Redo2 className="h-4 w-4" />
        </button>

        {/* Image Upload Button */}
        <div className="mr-auto">
          <button
            type="button"
            disabled={disabled || uploadingImage}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleImagePick}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3 py-1.5 text-[11px] font-bold text-brand-gold shadow-xs transition-colors hover:bg-brand-greenLight disabled:opacity-50 cursor-pointer"
          >
            {uploadingImage ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            <span>
              {uploadingImage ? "در حال آپلود..." : "افزودن تصویر در مکان مکان‌نما"}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Inline Link Input Bar */}
      {linkPopoverOpen && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200/80 bg-brand-iceLight/60 px-3 py-2">
          <input
            type="url"
            dir="ltr"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyLink();
              }
            }}
            placeholder="https://example.com"
            className="flex-1 min-w-[200px] rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-left font-mono text-xs text-brand-navy outline-none focus:border-brand-green"
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="rounded-full bg-brand-navy px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-brand-green cursor-pointer"
          >
            ثبت لینک
          </button>
          <button
            type="button"
            onClick={() => setLinkPopoverOpen(false)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-muted hover:text-brand-navy cursor-pointer"
          >
            بستن
          </button>
        </div>
      )}

      {/* Editable Writing Surface */}
      <div className="relative">
        {isEmpty && (
          <div className="pointer-events-none absolute top-4 right-4 text-sm text-gray-400">
            متن مقاله را اینجا بنویسید... برای افزودن تصویر، مکان‌نما را در محل
            دلخواه قرار دهید و روی «افزودن تصویر در مکان مکان‌نما» کلیک کنید.
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="متن کامل مقاله"
          onInput={syncContent}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onBlur={saveSelection}
          className={cn(
            "min-h-[300px] max-h-[460px] overflow-y-auto px-4 py-4 text-sm leading-8 text-brand-navy outline-none",
            "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-brand-navy",
            "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand-navy",
            "[&_p]:my-2",
            "[&_strong]:font-extrabold [&_b]:font-extrabold",
            "[&_em]:italic [&_i]:italic",
            "[&_u]:underline",
            "[&_blockquote]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-brand-gold [&_blockquote]:bg-brand-cream/70 [&_blockquote]:px-4 [&_blockquote]:py-2.5 [&_blockquote]:rounded-l-xl [&_blockquote]:text-brand-navy/90",
            "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pr-6",
            "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pr-6",
            "[&_li]:my-1",
            "[&_a]:text-brand-green [&_a]:underline [&_a]:font-semibold",
            "[&_figure]:my-4 [&_figure]:overflow-hidden [&_figure]:rounded-2xl [&_figure]:border [&_figure]:border-gray-200/80 [&_figure]:bg-brand-cream/40",
            "[&_img]:mx-auto [&_img]:max-h-[360px] [&_img]:w-full [&_img]:object-contain [&_img]:rounded-xl"
          )}
        />
      </div>
    </div>
  );
}
