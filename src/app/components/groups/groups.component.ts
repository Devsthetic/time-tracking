import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GroupService } from '@services/group.service';
import { OrganizationService } from '@services/organization.service';
import { UserService } from '@services/user.service';
import { Subscription } from 'rxjs';
import { Group, Organization, Pagination, SortCriteria, User } from '@models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { filterObjectArray, pageTable, setPaging, sortTable } from '@utils';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filterInput: HTMLInputElement;
    groupForm: FormGroup;
    groups: Group[] = [];
    orgs: Organization[] = [];
    pagedGroups: Group[] = [];
    paging: Pagination;
    pagination: Pagination;
    filter: string;
    sort: SortCriteria;
    subs: Subscription[] = [];
    users: User[] = [];

    constructor(
        private gs: GroupService,
        private os: OrganizationService,
        private us: UserService
    ) {
        this.pagination = {
            currentPage: 1,
            nextPage: null,
            numberPerPage: 20,
            pages: null,
            previousPage: null,
            totalPages: null,
            firstRecord: null,
            lastRecord: null,
            viewOptions: [10, 20, 50, 100],
        };
        this.sort = { col: 'id', dir: 'asc' };
    }

    ngOnInit(): void {
        this.setupForm();
        this.getGroups();
        this.getOrgs();
        this.getUsers();
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    createGroup(): void {
        this.subs.push(
            this.gs.createGroup(this.groupForm.value).subscribe(
                res => {
                    console.log(res);
                    this.groupForm.reset();
                    this.getGroups();
                },
                err => {
                    console.log(err);
                }
            )
        );
    }

    filterTable(term: string): void {
        console.log(this.filterInput);
        // this.filter = this.filterInput['nativeElement'].value;
        this.filter = term;
        if (this.filter) {
            this.pagedGroups = filterObjectArray(this.groups, this.filter);
            console.log(this.pagedGroups);
        } else {
            this.pagedGroups = this.groups;
        }
    }

    getGroups(): void {
        this.subs.push(
            this.gs.getGroups().subscribe(
                groups => {
                    this.groups = groups;
                    console.log(this.groups);
                    this.pageTable(null);
                },
                err => {
                    console.log(err);
                }
            )
        );
    }

    getUsers(): void {
        this.subs.push(
            this.us.getUsers().subscribe(
                users => {
                    this.users = users;
                    console.log(this.users);
                },
                err => {
                    console.log(err);
                }
            )
        );
    }

    getOrgs(): void {
        this.subs.push(
            this.os.getOrganizations().subscribe(
                orgs => {
                    this.orgs = orgs;
                    console.log(this.orgs);
                },
                err => {
                    console.log(err);
                }
            )
        );
    }

    pageTable(args: Pagination): void {
        this.pagination = Object.assign({}, this.pagination, args);
        console.log(this.pagination);
        this.pagination = setPaging(this.groups.length, this.pagination);
        console.log(this.pagination);
        this.filterTable(this.filter);
        console.log(this.pagedGroups);
        this.pagedGroups = pageTable(this.pagedGroups, this.pagination);
        console.log(this.pagedGroups);
        this.pagedGroups = sortTable(this.pagedGroups, this.sort);
        console.log(this.pagedGroups);
    }

    setNumberPerPage(): void {
        this.pageTable(null);
    }

    setSort(col: string, dir?: string): void {
        this.sort.col = col;
        if (dir) {
            this.sort.dir = dir;
        }
        this.pagedGroups = sortTable(this.pagedGroups, this.sort);
    }

    setupForm(): void {
        this.groupForm = new FormGroup({
            name: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z .]+$/),
            ]),
            organizationId: new FormControl(
                null,
                Validators.pattern(/^[0-9]+$/)
            ),
            displayName: new FormControl(
                null,
                Validators.pattern(/^[a-zA-Z0-9 .]+$/)
            ),
        });
        this.subs.push(
            this.groupForm.valueChanges.subscribe(() =>
                console.log(this.groupForm)
            )
        );
    }
}
