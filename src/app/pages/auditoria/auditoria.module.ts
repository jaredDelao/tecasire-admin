import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { AuditoriaComponent } from './auditoria.component';
import { SharedModule } from '@app/@shared';
import { MaterialModule } from '@app/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuditoriaComponent],
  imports: [
    CommonModule,
    AuditoriaRoutingModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
})
export class AuditoriaModule {}
