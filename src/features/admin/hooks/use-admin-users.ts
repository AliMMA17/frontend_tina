"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { ApiError } from "@/lib/api-client";
import { listAdminUsers } from "../services/admin-users.service";

export const PAGE_SIZE_OPTIONS = [20, 50, 100, 200] as const;

export function useAdminUsers(initialLimit = 50) {
  const [items, setItems] = useState<AuthUser[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimitState] = useState(() =>
    Math.min(200, Math.max(1, initialLimit))
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    listAdminUsers({ offset, limit })
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
            err instanceof Error ? err.message : "خطا در دریافت لیست کاربران."
          );
          setErrorStatus(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
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

  const setLimit = (nextLimit: number) => {
    const safeLimit = Math.min(200, Math.max(1, nextLimit));
    setLoading(true);
    setLimitState(safeLimit);
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
    currentPage,
    totalPages,
    loading,
    error,
    errorStatus,
    goToPage,
    setLimit,
    refetch,
  };
}
