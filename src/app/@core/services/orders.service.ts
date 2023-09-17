import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Order, OrderDetail } from '../interfaces/orders.models';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  url: string = environment.url + '/pedidos';

  constructor(private http: HttpClient) {}

  getAllOrders(page: string = '1', count: string = '10'): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + `?regxpag=${count}&pagina=${page}&authorizationToken=b3b5fa4dd6e77d8`);
  }

  getOrderById(idOrder: string): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.url + `/id?iIdPedido=${idOrder}`);
  }
}
