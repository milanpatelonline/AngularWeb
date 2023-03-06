import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    usertypes?: any[];
    userType:any;

    constructor(private accountService: AccountService,
        private alertService: AlertService) {}

    ngOnInit() {
        this.alertService.clear();
        this.userType=localStorage.getItem("userRole")
        this.accountService.getAllType().pipe(first()).subscribe((usertypes:any) => this.usertypes = usertypes.result);        
    }

    deleteUsertype(id: string) {        
        if(confirm("Are you sure to Delete ")) {
           this.accountService.deleteType(id).pipe(first()).subscribe((x:any)=>{
                if(x!=null && x.errorMessage.length>0){
                    this.alertService.success(x.errorMessage[0], { keepAfterRouteChange: true });
                }else{
                this.usertypes = this.usertypes!.filter(x => x.roleId !== id);}
            });
          }
    }
}