export interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  httpStatusCode: number;
  message: string;
  data: null;
  timestamp: string;
}
