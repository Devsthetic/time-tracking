import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCredentials, Profile } from '../models';
import { Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import * as crypto from 'crypto-js';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8000/api/';
  private profile: Profile;
  authSub = new Subject<Profile>();
  authSub$ = this.authSub.asObservable();
  img: any;

  constructor(private http: HttpClient, private rt: Router) {}

  canActivate(): boolean {
    return !!localStorage.getItem('usr');
  }

  getProfile(): Profile {
    return this.profile;
  }

  getProfileImage(id: number) {
    this.http.get<any>(this.API_URL+'profile/img/id/'+id)
    .subscribe(file=> {
      this.img = file;
      console.log(file)
    }, err=> {
      console.log(err);
    });
  }

  isLoggedIn(): boolean {
    return !!this.profile;
  }

  login(credentials: LoginCredentials, redirect?: string) {
    if(redirect) console.log(redirect)
    this.http.get<Profile>(this.API_URL+'login/id/'+credentials.id+'/lastname/'+credentials.lastName)
    .subscribe(profile=> {
      this.profile = profile;
      this.authSub.next(profile);
      this.getProfileImage(this.profile.id);
      localStorage.setItem('usr', JSON.stringify({ id: profile.id, lastName: profile.lastName}));
      let location = redirect && redirect.length > 1 ? redirect : '/calendar';
      this.rt.navigate([location]);
    }, err=> {
      console.log(err);
      this.authSub.next(null);
    });
  }

  logout() {
    localStorage.clear();
    this.authSub.next(null);
  }
}
