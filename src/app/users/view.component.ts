import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';

@Component({ templateUrl: 'view.component.html' })
export class ViewComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    userdetail!:any;

    constructor(
       private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {        
        this.id = this.route.snapshot.params['id'];
        this.title = 'User Details';
        if (this.id) {
            this.loading = true;
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe((x:any) => {                    
                    this.userdetail=x.result;                    
                    this.loading = false;
                });
            }
    }
    get f() { return this.form.controls; }
}