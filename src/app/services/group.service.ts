import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, ErrorResponse } from '@models';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GroupService {
    private API_URL = `${environment.api}/api/groups`;

    constructor(private http: HttpClient) {}

    createGroup(group: Group): Observable<Group> {
        return this.http.post<Group>(`${this.API_URL}/create`, group);
    }

    getGroupById(id: number): Observable<Group> {
        return this.http.get<Group>(`${this.API_URL}/${id}`);
    }

    getGroups(): Observable<Group[]> {
        return this.http.get<Group[]>(this.API_URL);
    }

    handleError(err: ErrorResponse): void {
        console.log(err);
    }
}
