import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Result } from '../interfaces/common.models';
import { Address, PostalCode } from '../interfaces/postal-codes.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {
  url: string = environment.url + '/costosenvio';

  constructor(private http: HttpClient) {}

  getAllPostalCodes(page: number = 1, count: number = 10): Observable<GenericResp<PostalCode>> {
    return this.http.get<GenericResp<PostalCode>>(this.url + `?regxpag=${count}&pagina=${page}`);
  }

  getPostalCodeByID(id: string): Observable<GenericResp<PostalCode>> {
    return this.http.get<GenericResp<PostalCode>>(`${this.url}/${id}`);
  }

  addPostalCode(req: PostalCode): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  updatePostalCode(req: PostalCode): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  deletePostalCode(iIdCodigoPostal: string): Observable<Result> {
    return this.http.delete<Result>(`${this.url}/${iIdCodigoPostal}`);
  }

  getCp(cp: string): Observable<GenericResp<Address>> {
    return this.http.get<GenericResp<Address>>(`${environment.url}/catalogos/codigopostal/${cp}`);
  }
}
