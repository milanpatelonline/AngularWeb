import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: any | null;
    userType: any;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(){
        this.userType=localStorage.getItem("userRole");
      }

    logout() {
        this.accountService.logout();
    }
}