export interface TablePaginationInterface {
  from: number;
  to: number;
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}
