import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

const routes: Routes = [
  { path: '', component: OrdersListComponent },
  { path: ':id', component: OrderDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
