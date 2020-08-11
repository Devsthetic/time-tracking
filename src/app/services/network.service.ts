import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { Network, SuccessResponse } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  API_URL = environment.api+'/api/networks';

  constructor(private http: HttpClient) {}

  addNetworkById(network: Network): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.API_URL, network);
  }

  getNetworkByGroupId(id: any): Observable<Network> {
    return this.http.get<Network>(this.API_URL+'/groupId/'+id);
  }

  getNetworkByOrganizationId(id: any): Observable<Network> {
    return this.http.get<Network>(this.API_URL+'/organizationId/'+id);
  }

  getNetworkByUserId(id: any): Observable<Network> {
    return this.http.get<Network>(this.API_URL+'/userId/'+id);
  }

  handleError(err: any) {
    console.log(err)
  }
}
