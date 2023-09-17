import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCouponsComponent } from './add-edit-coupons/add-edit-coupons.component';
import { AddEditProductDiscountComponent } from './add-edit-product-discount/add-edit-product-discount.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'discount-product', component: AddEditProductDiscountComponent },
  { path: 'discount-product/:id', component: AddEditProductDiscountComponent },
  { path: 'coupon', component: AddEditCouponsComponent },
  { path: 'coupon/:id', component: AddEditCouponsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
