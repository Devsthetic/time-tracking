import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OrganizationService } from '@services/organization.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Organization, Pagination, SortCriteria } from '@models';
import { filterObjectArray, pageTable, setPaging, sortTable } from '@functions';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit, OnDestroy {

  @ViewChild('filter') filterInput: HTMLInputElement;
  orgs: Organization[] = [];
  pagedOrgs: Organization[] = [];
  paging: Pagination;
  pagination: Pagination;
  filter: string;
  sort: SortCriteria;
  subs: Subscription[] = [];

  constructor(private os: OrganizationService) {
    this.pagination = {
      currentPage: 1,
      nextPage: null,
      numberPerPage: 20,
      pages: null,
      previousPage: null,
      totalPages: null,
      firstRecord: null,
      lastRecord: null,
      viewOptions: [10, 20, 50, 100]
    };
    this.sort = { col: 'id', dir: 'asc'};
  }

  ngOnInit() {
    this.getOrgs();
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  filterTable(term: string) {
    console.log(this.filterInput)
    // this.filter = this.filterInput['nativeElement'].value;
    this.filter = term;
    if(this.filter) {
      this.pagedOrgs = filterObjectArray(this.orgs, this.filter);
      console.log(this.pagedOrgs)
    } else {
      this.pagedOrgs = this.orgs;
    }
  }

  getOrgs() {
    this.subs.push(this.os.getOrganizations()
    .subscribe(orgs=> {
      this.orgs = orgs;
      console.log(this.orgs)
      this.pageTable(null);
    }, err=> {
      console.log(err)
    }));
  }

  pageTable(args: any) {
    this.pagination = Object.assign({}, this.pagination, args);
    console.log(this.pagination)
    this.pagination = setPaging(this.orgs.length, this.pagination);
    console.log(this.pagination)
    this.filterTable(this.filter);
    console.log(this.pagedOrgs)
    this.pagedOrgs = pageTable(this.pagedOrgs, this.pagination);
    console.log(this.pagedOrgs)
    this.pagedOrgs = sortTable(this.pagedOrgs, this.sort);
    console.log(this.pagedOrgs)
  }

  setNumberPerPage() {
    this.pageTable(null);
  }

  setPage(pageNumber: number) {
    if(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.pageTable(null);
    }
  }

  setSort(col: string, dir?: string) {
    this.sort.col = col;
    if(dir) this.sort.dir = dir;
    this.pagedOrgs = sortTable(this.pagedOrgs, this.sort);
  }

}
