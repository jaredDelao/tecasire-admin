import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Result } from '../interfaces/common.models';
import { Coupon, UpdateCoupon } from '../interfaces/coupon.models';
import { Address, PostalCode, PostalCodeUpdate } from '../interfaces/postal-codes.models';

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {
  url: string = environment.url + '/costoenvios';

  constructor(private http: HttpClient) {}

  getAllPostalCodes(page: string = '1', count: string = '10'): Observable<PostalCode[]> {
    return this.http.get<PostalCode[]>(this.url + `?regxpag=${count}&pagina=${page}`);
  }

  getPostalCodeByID(id: string): Observable<PostalCode[]> {
    return this.http.get<PostalCode[]>(this.url + `/id?Id=${id}`);
  }

  addPostalCode(req: PostalCodeUpdate): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  updatePostalCode(req: PostalCodeUpdate): Observable<Result> {
    return this.http.put<Result>(this.url, req);
  }

  deletePostalCode(iIdCodigoPostal: string): Observable<Result> {
    return this.http.delete<Result>(this.url, { body: { iIdCodigoPostal } });
  }

  getCp(cp: string): Observable<Address[]> {
    return this.http
      .get<Address[]>(environment.urlFigueacero + `cp?iCodigoPostal=${cp}`)
      .pipe(map((res) => res['resultDto']['sDetalle']));
  }
}
