import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: any[];
    userType:any;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.userType=localStorage.getItem("userRole")
        this.accountService.getAll().pipe(first()).subscribe((users:any) => this.users = users.result);        
    }

    deleteUser(id: string) {        
        if(confirm("Are you sure to Active/Deactive ")) {
            const user = this.users!.find(x => x.userId === id);
            if(user.isActive){
            user.isActive = false;
            this.accountService.delete(id)
                .pipe(first())
                .subscribe();
            }
            else{
            user.isActive=true
            this.accountService.active(id)
                .pipe(first())
                .subscribe();
            }
          }
    }
}