import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimeEntry, TimeCode, Department } from '@models';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    /* TODO: split non-time crud operations to new service */

    constructor(private http: HttpClient) {}

    getAllTime(id: number): Observable<TimeEntry[]> {
        return this.http.get<TimeEntry[]>(`${environment.api}time/id/${id}`);
    }

    getAllTimeByDate(date: string): Observable<TimeEntry[]> {
        return this.http.get<TimeEntry[]>(
            `${environment.api}time/date/all/${date}`
        );
    }

    getAllTimeByPeriod(
        startDate: string,
        endDate: string
    ): Observable<TimeEntry[]> {
        return this.http.get<TimeEntry[]>(
            `${environment.api}time/period/start/${startDate}/end/${endDate}`
        );
    }

    getTimeByDate(id: number, date: string): Observable<TimeEntry[]> {
        return this.http.get<TimeEntry[]>(
            `${environment.api}time/id/${id}/date/${date}`
        );
    }

    getTimeByPeriod(
        id: number,
        startDate: string,
        endDate: string
    ): Observable<TimeEntry[]> {
        return this.http.get<TimeEntry[]>(
            `${environment.api}time/id/${id}/start/${startDate}/end/${endDate}`
        );
    }

    getTimeCodes(): Observable<TimeCode[]> {
        return this.http.get<TimeCode[]>(`${environment.api}time/codes`);
    }

    getAllDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(`${environment.api}dept`);
    }

    getDepartment(id: number): Observable<Department> {
        console.log('called get department');
        return this.http.get<Department>(`${environment.api}dept/id/${id}`);
    }

    setTimeByDate(entry: TimeEntry): Observable<TimeEntry> {
        return this.http.post<TimeEntry>(`${environment.api}/time}`, entry);
    }
}
