import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditCouponsComponent } from './add-edit-coupons/add-edit-coupons.component';
import { CouponsComponent } from './coupons/coupons.component';
import { AddEditProductDiscountComponent } from './add-edit-product-discount/add-edit-product-discount.component';
import { ProductDiscountComponent } from './product-discount/product-discount.component';
import { ImagesComponent } from './images/images.component';
import { SettingsComponent } from './settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '@app/@shared';
import { LoadImageComponent } from './@modals/load-image/load-image.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AddEditCouponsComponent,
    CouponsComponent,
    AddEditProductDiscountComponent,
    ProductDiscountComponent,
    ImagesComponent,
    SettingsComponent,
    LoadImageComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    NgbModule,
  ],
})
export class SettingsModule {}
