import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    userRoles :any=[];
    userResult:any;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    // userRoles = [
    //     {name: 'Admin', id: 1},
    //     {name: 'Manager', id: 2},
    //     {name: 'User', id: 3}
    //   ];

    ngOnInit() {        
        this.accountService.getAllType().pipe(first()).subscribe((usertypes:any) => {
            this.userRoles = usertypes.result
        });         
        this.id = this.route.snapshot.params['id'];
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            designation: ['', Validators.required],
            emailAddress: ['', Validators.required],
            roleId: ['', Validators.required],
            username: ['', !this.id ? Validators.required:[]],
            // password only required in add mode
            password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]]
        });

        this.title = 'Add User';
        if (this.id) {
            // edit mode
            this.title = 'Edit User';
            this.loading = true;
            this.accountService.getById(this.id)
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
                next: (data:any) => {
                    if(data!=null && data.errorMessage.length>0){
                        this.alertService.success(data.errorMessage[0], { keepAfterRouteChange: true });
                    }else{
                        this.alertService.success('User saved', { keepAfterRouteChange: true });
                    }
                    this.router.navigateByUrl('/users');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
        // this.saveUser()
        //     .pipe(first())
        //     .subscribe({
        //         next: () => {
        //             debugger;
        //             this.alertService.success('User saved', { keepAfterRouteChange: true });
        //             this.router.navigateByUrl('/users');
        //         },
        //         error: error => {
        //             this.alertService.error(error);
        //             this.submitting = false;
        //         }
        //     })
    }

    private saveUser() {        
        return this.id
            ? this.accountService.update(this.id!, this.form.value)
            : this.accountService.register(this.form.value);
    }
}