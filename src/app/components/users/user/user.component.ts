import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GroupService } from '@services/group.service';
import { OrganizationService } from '@services/organization.service';
import { UserService } from '@services/user.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Group, Organization, User, Pagination, SortCriteria } from '@models';
import { Router, ActivatedRoute } from '@angular/router';
import { filterObjectArray, pageTable, setPaging, sortTable } from '@functions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  activeTable: string;
  user: User;
  group: Group;
  groupUsers: User[] = [];
  groupFilter: string;
  groupPagination: Pagination;
  groupSort: SortCriteria;
  pagedGroupUsers: User[] = [];
  org: Organization;
  orgFilter: string;
  orgPagination: Pagination;
  orgSort: SortCriteria;
  orgUsers: User[] = [];
  pagedOrgUsers: User[] = [];
  subs: Subscription[] = [];

  defaultPagination: Pagination = {
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

  defaultSort: SortCriteria = { col: 'id', dir: 'asc'};

  // Filter only these display cols in tables
  filterKeys = ['id', 'firstName', 'lastName', 'email'];

  constructor(private gs: GroupService,
    private os: OrganizationService,
    private us: UserService,
    private rt: ActivatedRoute) {
    this.subs.push(this.rt.params
     .subscribe(params => {
       // console.log(params)
       if(params.id) this.getUserById(params.id);
     }));
  }

  ngOnInit() {
    this.orgPagination = this.groupPagination = this.defaultPagination;
    this.orgSort = this.groupSort = this.defaultSort;
    this.activeTable = 'org';
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  filterTable(refName: string, term: string) {
    let filterRef = refName+'Filter';
    // console.log(filterRef)
    let pagedRefName = refName.charAt(0).toUpperCase()+refName.substr(1);
    // console.log(pagedRefName);
    let pagedTableRef = 'paged'+pagedRefName+'Users';
    // console.log(pagedTableRef)
    let tableRef = refName+'Users';
    // console.log(tableRef)
    this[filterRef] = term;
    // console.log(this[filterRef])
    if(this[filterRef] && this[filterRef].length) {
      this[pagedTableRef] = filterObjectArray(this[tableRef], this[filterRef], this.filterKeys);
      // console.log(this[pagedTableRef])
    } else {
      this[pagedTableRef] = this[tableRef];
    }
  }

  getUserById(id: string) {
    this.subs.push(this.us.getUserById(id)
    .subscribe(user=> {
      this.user = user;
      // console.log(this.user)
      this.getGroupById();
      this.getOrganizationById();
      if(this.user.groupId) this.getUsersByGroupId(this.user.groupId, this.user.id);
      if(this.user.organizationId) this.getUsersByOrganizationId(this.user.organizationId, this.user.id);
    }, err=> {
      console.log(err)
    }));
  }

  getGroupById() {
    if(this.user.groupId) {
      this.subs.push(this.gs.getGroupById(this.user.groupId)
      .subscribe(group=> {
        this.group = group;
        // console.log(this.group)
      }, err=> {
        console.log(err)
      }));
    }
  }

  getOrganizationById() {
    if(this.user.organizationId) {
      this.subs.push(this.os.getOrganizationById(this.user.organizationId)
      .subscribe(org=> {
        this.org  = org;
        // console.log(this.org)
      }, err=> {
        console.log(err)
      }));
    }
  }

  getUsersByGroupId(groupId: number, userId: number) {
    if(this.user.groupId) {
      this.subs.push(this.us.getUsersByGroupId(groupId, userId)
      .subscribe(users=> {
        this.groupUsers = users;
        // console.log(this.groupUsers)
        this.pageTable('group', this.groupPagination);
      }, err=> {
        console.log(err)
        this.handleTableError('group');
      }));
    }
  }

  getUsersByOrganizationId(orgId: number, userId: number) {
    if(this.user.organizationId) {
      this.subs.push(this.us.getUsersByOrganizationId(orgId, userId)
      .subscribe(users=> {
        this.orgUsers  = users;
        // console.log(this.orgUsers)
        this.pageTable('org', this.orgPagination);
      }, err=> {
        console.log(err)
        this.handleTableError('org');
      }));
    }
  }

  handleTableError(refName: string) {
    let filterRef = refName+'Filter';
    let pagedRefName = refName.charAt(0).toUpperCase()+refName.substr(1);
    let pagedTableRef = 'paged'+pagedRefName+'Users';
    let sortRef = refName+'Sort';
    let tableRef = refName+'Users';
    let paginationRef = refName+'Pagination';
    this[filterRef] = null;
    this[pagedTableRef] = [];
    this[tableRef] = [];
    this[sortRef] = this.defaultSort;
    this[paginationRef] = this.defaultPagination;
  }

  pageTable(refName: string, args: any) {
    let filterRef = refName+'Filter';
    let pagedRefName = refName.charAt(0).toUpperCase()+refName.substr(1);
    // console.log(pagedRefName)
    let pagedTableRef = 'paged'+pagedRefName+'Users';
    // console.log(pagedTableRef)
    let sortRef = refName+'Sort';
    // console.log(sortRef)
    let tableRef = refName+'Users';
    // console.log(tableRef)
    let paginationRef = refName+'Pagination';
    // console.log(paginationRef)

    this[paginationRef] = Object.assign({}, this[paginationRef], args);
    // console.log(this[paginationRef])
    this[paginationRef] = setPaging(this[tableRef].length, this[paginationRef]);
    // console.log(this[paginationRef])
    this.filterTable(refName, this[filterRef]);
    // console.log(this[pagedTableRef])
    this[pagedTableRef] = pageTable(this[pagedTableRef], this[paginationRef]);
    // console.log(this[pagedTableRef])
    this[pagedTableRef] = sortTable(this[pagedTableRef], this[sortRef]);
    // console.log(this[pagedTableRef])
  }

  setNumberPerPage(refName: string) {
    this.pageTable(refName, null);
  }

  setSort(refName: string, col: string, dir?: string) {
    let pagedRefName = refName.charAt(0).toUpperCase()+refName.substr(1);
    let pagedTableRef = 'paged'+pagedRefName+'Users';
    let sortRef = refName+'Sort';
    this[sortRef].col = col;
    if(dir) this[sortRef].dir = dir;
    this[pagedTableRef] = sortTable(this[pagedTableRef], this[sortRef]);
  }

}
