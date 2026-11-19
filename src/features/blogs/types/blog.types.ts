export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  author_id: string;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedBlogsResponse {
  items: BlogPost[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListBlogsParams {
  offset?: number;
  limit?: number;
}

export interface AdminListBlogsParams extends ListBlogsParams {
  is_published?: boolean | null;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  slug?: string | null;
  summary?: string | null;
  cover_image_url?: string | null;
  is_published: boolean;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  slug?: string;
  summary?: string | null;
  cover_image_url?: string | null;
  is_published?: boolean;
}
