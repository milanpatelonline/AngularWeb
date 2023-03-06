import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsertypeRoutingModule } from './usertype-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsertypeRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        
    ]
})
export class UsertypeModule { }