import { Component, OnDestroy, OnInit } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { OrdersService } from '@app/@core/services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderDetail, OrderDetailData } from '@app/@core/interfaces/orders.models';
import * as _ from 'lodash';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  faChevronLeft = faChevronLeft;
  order: OrderDetail[] = [];
  orderInfo!: OrderDetailData;

  $unsubscribe = new Subject<void>();

  constructor(private orderService: OrdersService, private activRoute: ActivatedRoute) {
    this.getUrlParams();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private getUrlParams() {
    this.activRoute.params.pipe(takeUntil(this.$unsubscribe)).subscribe((params) => {
      if (params?.['id']) this.getOrderByID(params['id']);
    });
  }

  private getOrderByID(id: string) {
    this.orderService
      .getOrderById(id)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((order) => {
        this.order = order.splice(0, order.length - 1);
        if (order.length > 0) {
          let orderInfo = _.last(order) as unknown;
          this.orderInfo = orderInfo as OrderDetailData;
        }
      });
  }
}
