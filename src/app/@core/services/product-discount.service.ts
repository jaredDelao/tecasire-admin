import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Result } from '../interfaces/common.models';
import { Discount, DiscountCreate, DiscountUpdate } from '../interfaces/discounts.models';

@Injectable({
  providedIn: 'root',
})
export class ProductDiscountService {
  url: string = environment.url + '/descuentos';

  constructor(private http: HttpClient) {}

  getDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.url);
  }

  getDiscountById(id: number): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.url + `/id?Id=${id}`);
  }

  createDiscount(req: DiscountCreate): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  updateDiscount(req: DiscountUpdate): Observable<Result> {
    return this.http.put<Result>(this.url, req);
  }
}
