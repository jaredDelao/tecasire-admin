import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostalCodesRoutingModule } from './postal-codes-routing.module';
import { PostalCodesComponent } from './postal-codes.component';
import { AddEditPostalCodesComponent } from './add-edit-postal-codes/add-edit-postal-codes.component';
import { SharedModule } from '@app/@shared';
import { MaterialModule } from '@app/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PostalCodesComponent, AddEditPostalCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostalCodesRoutingModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    FontAwesomeModule,
  ],
})
export class PostalCodesModule {}
