import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { AppComponent } from '@app/app.component';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private appComponent:AppComponent
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: (data:any) => {
                    if(data!=null && data.isSuccess){
                        this.appComponent.userType=localStorage.getItem("userRole");
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
                        this.router.navigateByUrl(returnUrl);
                    }
                    else{
                        this.alertService.error(data.message);
                        this.loading = false;
                    }
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}