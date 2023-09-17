import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { AuditoriaComponent } from './auditoria.component';
import { SharedModule } from '@app/@shared';
import { MaterialModule } from '@app/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AuditoriaComponent],
  imports: [CommonModule, AuditoriaRoutingModule, SharedModule, MaterialModule, NgbModule, FontAwesomeModule],
})
export class AuditoriaModule {}
