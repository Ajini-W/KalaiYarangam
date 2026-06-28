import { apiClient } from "./api-client";

export type SearchType = "students" | "leads" | "batches" | "trainers";

export interface SearchResultItem {
  id: string;
  label: string;
  subtitle?: string;
  meta?: Record<string, string>;
}

interface ApiEnvelope<T> {
  data: T;
}

const SEARCH_PATHS: Record<SearchType, string> = {
  students: "/search/students",
  leads: "/search/leads",
  batches: "/search/batches",
  trainers: "/search/trainers",
};

export async function searchEntities(
  searchType: SearchType,
  query: string,
  extraParams?: Record<string, string>,
): Promise<SearchResultItem[]> {
  const response = await apiClient.get<ApiEnvelope<SearchResultItem[]>>(
    SEARCH_PATHS[searchType],
    { params: { q: query, ...extraParams } },
  );
  const payload = response.data.data ?? response.data;
  return Array.isArray(payload) ? payload : [];
}
