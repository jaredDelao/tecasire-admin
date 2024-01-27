import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { SortableHeaderDirective } from './directives/sortable-header.directive';
import { ModalGenericComponent } from './components/modal-generic/modal-generic.component';
import { ProfileNamePipe } from './pipes/profile-name.pipe';
import { BtnStatusOrderComponent } from './components/btn-status-order/btn-status-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModaUpdatePasswordComponent } from './components/moda-update-password/moda-update-password.component';
import { ValidInputDirective } from './directives/valid-input.directive';

const COMPONENTS = [LoaderComponent, ModalGenericComponent, BtnStatusOrderComponent, ModaUpdatePasswordComponent];
@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [...COMPONENTS, SortableHeaderDirective, ProfileNamePipe, ValidInputDirective, ValidInputDirective],
  exports: [...COMPONENTS, SortableHeaderDirective, ProfileNamePipe, ValidInputDirective],
})
export class SharedModule {}
