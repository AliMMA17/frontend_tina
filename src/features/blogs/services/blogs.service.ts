import { apiClient, parseApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/env";
import { tokenStorage } from "@/lib/tokens";
import type {
  AdminListBlogsParams,
  BlogPost,
  CreateBlogPayload,
  ListBlogsParams,
  PaginatedBlogsResponse,
  UpdateBlogPayload,
  UploadedImageResponse,
} from "../types/blog.types";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

function buildPaginationQuery({ offset = 0, limit = DEFAULT_LIMIT }: ListBlogsParams) {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
  return new URLSearchParams({
    offset: String(safeOffset),
    limit: String(safeLimit),
  });
}

function handleAdminUnauthorized(status: number): void {
  if (status === 401) {
    tokenStorage.clearTokens();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }
}

export async function listPublishedBlogs(
  params: ListBlogsParams = {}
): Promise<PaginatedBlogsResponse> {
  const query = buildPaginationQuery(params);
  const response = await apiClient(`${API_ENDPOINTS.blogs}?${query.toString()}`, {
    method: "GET",
    skipAuth: true,
  });

  if (!response.ok) {
    throw await parseApiError(response, "خطا در دریافت مقالات وبلاگ.");
  }

  return response.json();
}

export async function getPublishedBlogBySlug(slug: string): Promise<BlogPost> {
  const response = await apiClient(
    `${API_ENDPOINTS.blogs}/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      skipAuth: true,
    }
  );

  if (!response.ok) {
    throw await parseApiError(response, "مقاله مورد نظر یافت نشد.");
  }

  return response.json();
}

export async function listAdminBlogs({
  offset = 0,
  limit = 20,
  is_published,
}: AdminListBlogsParams = {}): Promise<PaginatedBlogsResponse> {
  const query = buildPaginationQuery({ offset, limit });
  if (typeof is_published === "boolean") {
    query.set("is_published", String(is_published));
  }

  const response = await apiClient(
    `${API_ENDPOINTS.blogs}/admin?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    handleAdminUnauthorized(response.status);
    throw await parseApiError(response, "خطا در دریافت فهرست مقالات.");
  }

  return response.json();
}

export async function createAdminBlog(
  payload: CreateBlogPayload
): Promise<BlogPost> {
  const response = await apiClient(API_ENDPOINTS.blogs, {
    method: "POST",
    body: JSON.stringify({
      title: payload.title.trim(),
      content: payload.content.trim(),
      slug: payload.slug?.trim() || null,
      summary: payload.summary?.trim() || null,
      cover_image_url: payload.cover_image_url?.trim() || null,
      is_published: payload.is_published,
    }),
  });

  if (!response.ok) {
    handleAdminUnauthorized(response.status);
    throw await parseApiError(response, "خطا در ثبت مقاله جدید.");
  }

  return response.json();
}

export async function updateAdminBlog(
  blogId: string,
  payload: UpdateBlogPayload
): Promise<BlogPost> {
  const response = await apiClient(`${API_ENDPOINTS.blogs}/${blogId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    handleAdminUnauthorized(response.status);
    throw await parseApiError(response, "خطا در ویرایش مقاله.");
  }

  return response.json();
}

export async function deleteAdminBlog(blogId: string): Promise<void> {
  const response = await apiClient(`${API_ENDPOINTS.blogs}/${blogId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    handleAdminUnauthorized(response.status);
    throw await parseApiError(response, "خطا در حذف مقاله.");
  }
}

export async function uploadBlogImage(
  file: File
): Promise<UploadedImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient(API_ENDPOINTS.uploadImage, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    handleAdminUnauthorized(response.status);
    throw await parseApiError(response, "خطا در آپلود تصویر.");
  }

  return response.json();
}
