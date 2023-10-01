import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Order, OrderDetail } from '../interfaces/orders.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  url: string = environment.url;

  constructor(private http: HttpClient) {}

  getAllOrders(pagina: string, regxpag: string): Observable<GenericResp<Order>> {
    let body = new HttpParams({
      fromObject: {
        regxpag,
        pagina,
      },
    });
    return this.http.get<GenericResp<Order>>(`${this.url}/pedidos`, { params: body });
  }

  getOrderById(idOrder: string): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.url + `/id?iIdPedido=${idOrder}`);
  }
}
