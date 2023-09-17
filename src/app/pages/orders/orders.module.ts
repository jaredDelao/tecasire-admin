import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { SharedModule } from '@app/@shared';
import { MaterialModule } from '@app/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [OrdersListComponent, OrderDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OrdersRoutingModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    NgbModule,
  ],
  providers: [],
})
export class OrdersModule {}
