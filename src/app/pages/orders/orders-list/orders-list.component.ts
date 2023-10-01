import { AfterViewInit, Component, OnDestroy, OnInit, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Order } from '@app/@core/interfaces/orders.models';
import { compare, SortEvent } from '@app/@core/interfaces/sortable.model';
import { OrdersService } from '@app/@core/services/orders.service';
import { SortableHeaderDirective } from '@app/@shared/directives/sortable-header.directive';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import {
  faCoffee,
  faPencilAlt,
  faStoreAlt,
  faTruckMoving,
  faFilePdf,
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  providers: [CurrencyPipe],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective> | undefined;
  orders: Order[] = [];
  totalPages: number = 0;

  faCoffee = faCoffee;
  faPencil = faPencilAlt;
  faStoreAlt = faStoreAlt;
  faTruckMoving = faTruckMoving;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;

  filter = new FormControl('');
  orders$ = new BehaviorSubject<Order[]>([]);
  page = 1;
  isLoading = true;

  $unsubscribe = new Subject<void>();

  constructor(private orderService: OrdersService, private currencyPipe: CurrencyPipe) {}

  ngOnInit(): void {
    this.filtered();
    this.getOrders();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  filtered(): void {
    this.filter.valueChanges.pipe(startWith('')).subscribe((text) => {
      if (!text) return this.orders$.next(this.orders);
      this.orders$.next(this.search(text, this.currencyPipe));
    });
  }

  pageChange(id: number) {
    this.page = id;
  }

  private search(text: string, pipe: PipeTransform): Order[] {
    return this.orders.filter((order) => {
      const term = text.toLowerCase();
      return order?.nombre.toLowerCase().includes(term) || order?.dFechaPedido.includes(term);
    });
  }

  onSort(evt: Event) {
    // this.filter.reset();
    // Resetting other headers
    const { column, direction } = evt as unknown as SortEvent;
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // Sorting
    if (direction === '' || column === '') {
      this.orders$.next(this.orders);
      this.filter.reset();
    } else {
      const orders = [...this.orders$.value].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
      this.orders$.next(orders);
    }
  }

  downloadFile(uri: string, name: string) {
    let link = document.createElement('a');
    link.download = name;
    link.href = uri;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
  }

  private getOrders(page: number = 1): void {
    this.isLoading = true;
    this.orderService
      .getAllOrders(page.toString(), '10')
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (ordersResp) => {
          const orders = ordersResp.data;
          this.orders = orders;
          this.orders$.next(orders);
          this.totalPages = ordersResp.extradata.iTotalPags;
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
}
