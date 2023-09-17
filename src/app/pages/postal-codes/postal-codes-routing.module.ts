import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPostalCodesComponent } from './add-edit-postal-codes/add-edit-postal-codes.component';
import { PostalCodesComponent } from './postal-codes.component';

const routes: Routes = [
  { path: '', component: PostalCodesComponent },
  { path: 'cp', component: AddEditPostalCodesComponent },
  { path: 'cp/:id', component: AddEditPostalCodesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostalCodesRoutingModule {}
