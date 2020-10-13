import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationCriteria, Organization } from '@models';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    API_URL = environment.api + '/api/organizations';

    constructor(private http: HttpClient) {}

    createOrganization(org: Organization): Observable<Organization> {
        return this.http.post<Organization>(this.API_URL, org);
    }

    getOrganizationById(id: number): Observable<Organization> {
        return this.http.get<Organization>(this.API_URL + '/' + id);
    }

    getOrganizations(): Observable<Organization[]> {
        return this.http.get<Organization[]>(this.API_URL);
    }

    setOrganizationLocation(
        criteria: LocationCriteria
    ): Observable<Organization> {
        return this.http.put<Organization>(
            this.API_URL + '/location',
            criteria
        );
    }

    handleError(err: HttpErrorResponse): void {
        console.log(err);
    }
}
