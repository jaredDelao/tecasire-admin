import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Carrusel, UpdateCarrusel } from '../interfaces/carrusel.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class CarruselService {
  url: string = `${environment.url}/carrusel`;

  constructor(private http: HttpClient) {}

  getImages(): Observable<GenericResp<Carrusel>> {
    return this.http.get<GenericResp<Carrusel>>(`${this.url}?nombrecarrusel=Inicio`);
  }

  uploadImage(req: UpdateCarrusel): Observable<GenericResp<[]>> {
    return this.http.put<GenericResp<[]>>(this.url, req);
  }

  updateImage(req: UpdateCarrusel): Observable<GenericResp<[]>> {
    return this.http.put<GenericResp<[]>>(this.url, req);
  }

  deleteImage(req: UpdateCarrusel): Observable<GenericResp<[]>> {
    return this.http.delete<GenericResp<[]>>(this.url, { body: req });
  }
}
