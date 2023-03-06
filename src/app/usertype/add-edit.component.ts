import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    pagetitle!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {        
        this.id = this.route.snapshot.params['id'];        
        this.form = this.formBuilder.group({
            roleName: ['', Validators.required]
        });

        this.pagetitle = 'Add User Type';
        if (this.id) {            
            this.pagetitle = 'Edit User Type';
            this.loading = true;
            this.accountService.getTypeById(this.id)
                .pipe(first())
                .subscribe((x:any) => {
                    this.form.patchValue(x.result);
                    this.loading = false;
                });
        }
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {        
       this.submitted = true;
       this.alertService.clear();
       if (this.form.invalid) {
            return;
        }
        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User Type saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/usertype');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveUser() {
        // create or update user based on id param
        return this.id
            ? this.accountService.updateType(this.id!, this.form.value)
            : this.accountService.createType(this.form.value);
    }
}