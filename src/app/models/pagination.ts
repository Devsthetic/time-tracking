export interface Pagination {
  currentPage?: number;
  nextPage?: number;
  numberPerPage?: number;
  pages?: number[];
  previousPage?: number;
  totalPages?: number;
  firstRecord?: number;
  lastRecord?: number;
  viewOptions?: number[];
}
