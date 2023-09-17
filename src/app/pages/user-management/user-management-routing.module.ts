import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEditUserManagementComponent } from './create-edit-user-management/create-edit-user-management.component';
import { UserManagementListComponent } from './user-management-list/user-management-list.component';

const routes: Routes = [
  { path: '', component: UserManagementListComponent },
  { path: 'user', component: CreateEditUserManagementComponent },
  { path: 'user/:id', component: CreateEditUserManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
