import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { GenericResp } from '../interfaces/generic.models';
import { Result } from '../interfaces/common.models';
import { Product } from '../interfaces/products.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url: string = environment.url + '/productos';

  constructor(private http: HttpClient) {}

  getProducts(page: number, iCategoria: string): Observable<GenericResp<Product>> {
    const body = new HttpParams({
      fromObject: {
        regxpag: 100,
        pagina: page,
        iTipoProducto: 1,
        iCategoria,
      },
    });
    return this.http.get<GenericResp<Product>>(this.url, { params: body });
  }

  getProductById(id: number): Observable<GenericResp<Product>> {
    return this.http.get<GenericResp<Product>>(`${this.url}/${id}`);
  }

  createProduct(req: any): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  updateProduct(req: any): Observable<Result> {
    return this.http.post<Result>(this.url, req);
  }

  deleteProduct(id: number): Observable<Result> {
    return this.http.delete<Result>(`${this.url}/${id}`);
  }
}
