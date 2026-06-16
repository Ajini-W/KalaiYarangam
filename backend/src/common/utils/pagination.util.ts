import { PaginatedResult } from '@/common/interfaces';

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
    },
  };
}

export function paginationArgs(page = 1, pageSize = 10) {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  return {
    skip: (safePage - 1) * safeSize,
    take: safeSize,
    page: safePage,
    pageSize: safeSize,
  };
}
