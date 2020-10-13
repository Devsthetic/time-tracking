import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    subs: Subscription[];

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.subs = [];
        this.setupForm();
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    login(): void {
        this.auth.login(this.loginForm.value);
    }

    setupForm(): void {
        this.loginForm = new FormGroup({
            id: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
        });
    }

    testLogin(): void {
        this.loginForm.patchValue({ id: '1', lastName: 'Tinsley' });
        this.login();
    }
}
