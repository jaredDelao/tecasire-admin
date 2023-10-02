import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Result } from '../interfaces/common.models';
import { Coupon, UpdateCoupon } from '../interfaces/coupon.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  url: string = environment.url + '/cupones';

  constructor(private http: HttpClient) {}

  getAllCoupons(page: number = 1, count: number = 10): Observable<GenericResp<Coupon>> {
    return this.http.get<GenericResp<Coupon>>(this.url + `?regxpag=${count}&pagina=${page}`);
  }

  getCouponById(idCoupon: number): Observable<GenericResp<Coupon>> {
    return this.http.get<GenericResp<Coupon>>(`${this.url}/${idCoupon}`);
  }

  createCoupon(req: UpdateCoupon): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  updateCoupon(req: Partial<UpdateCoupon>): Observable<Result> {
    return this.http.put<Result>(this.url, req);
  }
}
