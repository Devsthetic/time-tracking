import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '@services/user.service';
import { Observable, Subscription, timer } from 'rxjs';
import { User, Pagination, SortCriteria } from '@models';
import { filterObjectArray, pageTable, setPaging, sortTable } from '@functions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  @ViewChild('filter') filterInput: HTMLInputElement;
  users: User[] = [];
  pagedUsers: User[] = [];
  pagination: Pagination;
  filter: string;
  sort: SortCriteria;
  subs: Subscription[] = [];

  constructor(private us: UserService) {
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
    this.getUsers();
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  filterTable(term: string) {
    console.log(this.filterInput)
    // this.filter = this.filterInput['nativeElement'].value;
    this.filter = term;
    if(this.filter) {
      this.pagedUsers = filterObjectArray(this.users, this.filter);
      console.log(this.pagedUsers)
    } else {
      this.pagedUsers = this.users;
    }
  }

  getUsers() {
    this.subs.push(this.us.getUsers()
    .subscribe(users=> {
      this.users = users;
      console.log(this.users)
      this.pageTable(null);
    }, err=> {
      console.log(err)
    }));
  }

  pageTable(args: any) {
    this.pagination = Object.assign({}, this.pagination, args);
    console.log(this.pagination)
    this.pagination = setPaging(this.users.length, this.pagination);
    console.log(this.pagination)
    this.filterTable(this.filter);
    console.log(this.pagedUsers)
    this.pagedUsers = pageTable(this.pagedUsers, this.pagination);
    console.log(this.pagedUsers)
    this.pagedUsers = sortTable(this.pagedUsers, this.sort);
    console.log(this.pagedUsers)
  }

  setNumberPerPage() {
    this.pageTable(null);
  }

  setSort(col: string, dir?: string) {
    this.sort.col = col;
    if(dir) this.sort.dir = dir;
    this.pagedUsers = sortTable(this.pagedUsers, this.sort);
  }

  consoleLog(val: any) { console.log(val) }

}
