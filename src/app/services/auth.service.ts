import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCredentials, Profile } from '../models';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { WindowService } from '@services/window.service';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private profile: Profile;
    authSub = new Subject<Profile>();
    authSub$ = this.authSub.asObservable();
    img: Blob;

    constructor(
        private http: HttpClient,
        private rt: Router,
        private st: DomSanitizer,
        private ws: WindowService
    ) {}

    canActivate(): boolean {
        return !!localStorage.getItem('usr');
    }

    convertBlobToImage(img: Blob): void {
        const reader = new FileReader();
        reader.addEventListener(
            'load',
            () => {
                this.profile.img = reader.result;
                this.authSub.next(this.profile);
            },
            false
        );
        reader.readAsDataURL(img);
    }

    getProfile(userId: number): Observable<Profile> {
        return this.http.get<Profile>(`${environment.api}users/id/${userId}`);
    }

    getProfileImage(id: number): void {
        this.http.get<Blob>(`${environment.api}users/img/id/${id}`).subscribe(
            file => {
                this.convertBlobToImage(file);
            },
            err => {
                console.log(err);
            }
        );
    }

    getUser(): Profile {
        return this.profile;
    }

    isLoggedIn(): boolean {
        return !!this.profile;
    }

    login(credentials: LoginCredentials, redirect?: string): void {
        if (redirect) {
            console.log(redirect);
        }
        this.http
            .get<Profile>(
                `${environment.api}auth/id/${credentials.id}/lastname/${credentials.lastName}`
            )
            .subscribe(
                profile => {
                    this.profile = profile;
                    this.getProfileImage(this.profile.id);
                    localStorage.setItem(
                        'usr',
                        JSON.stringify({
                            id: profile.id,
                            lastName: profile.lastName,
                        })
                    );
                    const location =
                        redirect && redirect.length > 1
                            ? redirect
                            : '/calendar';
                    this.rt.navigate([location]);
                },
                err => {
                    console.log(err);
                    this.authSub.next(null);
                }
            );
    }

    logout(): void {
        localStorage.clear();
        this.rt.navigate(['/']);
    }
}
