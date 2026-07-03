import type { SearchResultItem } from "@/services/search.service";
import type { SearchType } from "@/services/search.service";

export const MOCK_SEARCH_RESULTS: Record<SearchType, SearchResultItem[]> = {
  students: [
    { id: "mock-stu-1", label: "Priya Sharma", subtitle: "priya@example.com" },
    { id: "mock-stu-2", label: "Arjun Menon", subtitle: "arjun@example.com" },
  ],
  leads: [
    { id: "mock-lead-1", label: "Kavya Nair", subtitle: "Walk-in · Bharatanatyam" },
    { id: "mock-lead-2", label: "Sanjay Patel", subtitle: "Referral · Carnatic Vocal" },
  ],
  batches: [
    { id: "mock-batch-1", label: "Bharatanatyam Beginners — Morning", subtitle: "12 students" },
    { id: "mock-batch-2", label: "Carnatic Vocal — Intermediate", subtitle: "10 students" },
  ],
  trainers: [
    { id: "mock-trainer-1", label: "Lakshmi Devi", subtitle: "Bharatanatyam" },
    { id: "mock-trainer-2", label: "Ravi Kumar", subtitle: "Carnatic Vocal" },
  ],
};

export function getMockSearchResults(
  searchType: SearchType,
  query: string,
): SearchResultItem[] {
  const items = MOCK_SEARCH_RESULTS[searchType];
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q),
  );
}
