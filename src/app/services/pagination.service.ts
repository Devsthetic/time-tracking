import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  currentPage: number;
  nextPage: number;
  numberPerPage: number;
  pages: number[];
  previousPage: number;
  totalPages: number;
  viewOptions: number[];

  constructor() {}

  setNextPage() {
    this.nextPage = this.currentPage && this.currentPage < this.totalPages ? this.currentPage + 1: null;
  }

  setPreviousPage() {
    this.totalPages = this.currentPage > 1 && this.currentPage < this.totalPages - 1? this.currentPage + 1: null;
  }

  setTotalPages(arrayLen: number) {
    this.totalPages = Math.ceil(arrayLen/this.numberPerPage);
  }
}
