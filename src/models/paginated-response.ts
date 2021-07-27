export interface PaginatedResponse<T> {
  data: Array<T>;
  total: number;
  skip: number;
  limit: number;
}
