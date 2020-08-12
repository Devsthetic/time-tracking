import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Address,
    LocationCriteria,
    ErrorResponse,
    GeoLocations,
    GeoAddressLocation,
} from '@models';

@Injectable({
    providedIn: 'root',
})
export class GeoLocationService {
    GEO_API_URL = 'http://api.geonames.org/';

    constructor(private http: HttpClient) {}

    /*  TODO: split out to map fn
        args represents an the value of the passed in form as an object */
    searchAddress(args: Address): Observable<GeoAddressLocation> {
        let url = this.GEO_API_URL + 'geoCodeAddressJSON?username=almcaffee&q=';
        console.log(args);
        Object.keys(args).forEach(key => {
            if (args[key] && key.indexOf('Ext') > -1) {
                url += '-' + args[key].toString();
            } else if (args[key]) {
                url += args[key].toString().split(' ').join('+');
            }
            if (1 < Object.keys(args).length - 1 && args[key]) {
                url += '+';
            }
        });
        return this.http.get<GeoAddressLocation>(url);
    }

    /* TODO: move username to .env in node or .environment in app */
    searchLocation(args: LocationCriteria): Observable<GeoLocations> {
        const url = `${
            this.GEO_API_URL
        }searchJSON?username=almcaffee&q=${Object.keys(args)
            .map(k => `&${k}=${args[k]}`)
            .join('')}`;
        return this.http.get<GeoLocations>(url);
    }

    /* TDOD: Add Error handling in Interceptor - maybe snackbar?  */
    handleError(err: ErrorResponse): void {
        console.log(err);
    }
}
