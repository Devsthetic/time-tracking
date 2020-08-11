import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { LocationCriteria, Organization } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  API_URL = environment.api+'/api/organizations';

  constructor(private http: HttpClient) {}

  createOrganization(org: Organization): Observable<Organization> {
    return this.http.post<Organization>(this.API_URL, org);
  }

  getOrganizationById(id: any): Observable<Organization> {
    return this.http.get<Organization>(this.API_URL+'/'+id);
  }

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.API_URL);
  }

  setOrganizationLocation(criteria: LocationCriteria): Observable<Organization> {
    return this.http.put<Organization>(this.API_URL+'/location', criteria);
  }

  handleError(err: any) {
    console.log(err)
  } 
}
