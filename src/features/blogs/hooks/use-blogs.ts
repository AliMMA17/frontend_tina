"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import {
  getPublishedBlogBySlug,
  listAdminBlogs,
  listPublishedBlogs,
} from "../services/blogs.service";
import type { BlogPost } from "../types/blog.types";

export const BLOG_PAGE_SIZE = 12;

export function usePublishedBlogs(initialLimit = BLOG_PAGE_SIZE) {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(() => Math.min(100, Math.max(1, initialLimit)));
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listPublishedBlogs({ offset, limit })
      .then((data) => {
        if (!active) return;
        setItems(data.items);
        setTotal(data.total);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "خطا در دریافت مقالات وبلاگ."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [offset, limit, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  const goToPage = (page: number) => {
    const clampedPage = Math.min(totalPages, Math.max(1, page));
    const nextOffset = (clampedPage - 1) * limit;
    if (nextOffset === offset) return;
    setLoading(true);
    setOffset(nextOffset);
  };

  const refetch = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  return {
    items,
    total,
    offset,
    limit,
    currentPage,
    totalPages,
    loading,
    error,
    goToPage,
    refetch,
  };
}

export function usePublishedBlog(slug: string) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    getPublishedBlogBySlug(slug)
      .then((data) => {
        if (!active) return;
        setBlog(data);
        setError(null);
        setErrorStatus(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiError) {
          setError(err.message);
          setErrorStatus(err.status);
        } else {
          setError(
            err instanceof Error ? err.message : "مقاله مورد نظر یافت نشد."
          );
          setErrorStatus(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, reloadKey]);

  const refetch = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  return { blog, loading, error, errorStatus, refetch };
}

export type BlogPublishFilter = "all" | "published" | "draft";

export function useAdminBlogs(initialLimit = 20) {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(() => Math.min(100, Math.max(1, initialLimit)));
  const [filter, setFilterState] = useState<BlogPublishFilter>("all");
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const isPublishedParam =
      filter === "all" ? null : filter === "published";

    listAdminBlogs({ offset, limit, is_published: isPublishedParam })
      .then((data) => {
        if (!active) return;
        setItems(data.items);
        setTotal(data.total);
        setError(null);
        setErrorStatus(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiError) {
          setError(err.message);
          setErrorStatus(err.status);
        } else {
          setError(
            err instanceof Error ? err.message : "خطا در دریافت فهرست مقالات."
          );
          setErrorStatus(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [offset, limit, filter, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  const goToPage = (page: number) => {
    const clampedPage = Math.min(totalPages, Math.max(1, page));
    const nextOffset = (clampedPage - 1) * limit;
    if (nextOffset === offset) return;
    setLoading(true);
    setOffset(nextOffset);
  };

  const setFilter = (nextFilter: BlogPublishFilter) => {
    if (nextFilter === filter) return;
    setLoading(true);
    setFilterState(nextFilter);
    setOffset(0);
  };

  const refetch = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  return {
    items,
    total,
    offset,
    limit,
    filter,
    currentPage,
    totalPages,
    loading,
    error,
    errorStatus,
    setFilter,
    goToPage,
    refetch,
  };
}
