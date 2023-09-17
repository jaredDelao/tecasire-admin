import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementListComponent } from './user-management-list/user-management-list.component';
import { CreateEditUserManagementComponent } from './create-edit-user-management/create-edit-user-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared';
import { MaterialModule } from '@app/material.module';
// import { ModaUpdatePasswordComponent } from '../../@shared/components/moda-update-password/moda-update-password.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [UserManagementListComponent, CreateEditUserManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    UserManagementRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
  ],
})
export class UserManagementModule {}
