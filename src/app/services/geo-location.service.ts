import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GeoLocationService {
    GEO_API_URL = 'http://api.geonames.org/';

    constructor(private http: HttpClient) {}

    /* args represents an the value of the passed in form as an object */
    searchAddress(args: any): Observable<any> {
        let url = this.GEO_API_URL + 'geoCodeAddressJSON?username=almcaffee&q=';
        console.log(args);
        Object.keys(args).forEach((key, i) => {
            if (key != 'lat' && key != 'lng') {
                if (args[key] && key.indexOf('Ext') > -1) {
                    url += '-' + args[key].toString();
                } else if (args[key]) {
                    url += args[key].toString().split(' ').join('+');
                }
                if (1 < Object.keys(args).length - 1 && args[key]) {
                    url += '+';
                }
            }
        });
        return this.http.get(url);
    }

    searchLocation(args: any): Observable<any> {
        let url = this.GEO_API_URL + 'searchJSON?username=almcaffee&q=';
        Object.keys(args).forEach((k, i) => {
            url += '&' + k + '=' + args[k];
        });
        return this.http.get(url);
    }

    handleError(err: any) {
        console.log(err);
    }
}
