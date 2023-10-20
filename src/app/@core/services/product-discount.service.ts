import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Result } from '../interfaces/common.models';
import { Discount } from '../interfaces/discounts.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class ProductDiscountService {
  url: string = environment.url + '/descuentos';

  constructor(private http: HttpClient) {}

  getDiscounts(page: string): Observable<GenericResp<Discount>> {
    const body = new HttpParams({
      fromObject: {
        regxpag: 100,
        pagina: page,
      },
    });
    return this.http.get<GenericResp<Discount>>(this.url, { params: body });
  }

  getDiscountById(id: number): Observable<GenericResp<Discount>> {
    return this.http.get<GenericResp<Discount>>(`${this.url}/${id}`);
  }

  createDiscount(req: Discount): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  updateDiscount(req: Discount): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }
}
