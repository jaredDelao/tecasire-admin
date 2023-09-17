import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Carrusel, UpdateCarrusel } from '../interfaces/carrusel.models';

interface Result {
  result: 'ok';
}

@Injectable({
  providedIn: 'root',
})
export class CarruselService {
  url: string = environment.url + '/imagenescarrusel';

  constructor(private http: HttpClient) {}

  getImages(): Observable<Carrusel[]> {
    return this.http.get<Carrusel[]>(this.url + '?nombrecarrusel=Inicio');
  }

  uploadImage(req: UpdateCarrusel): Observable<Result> {
    return this.http.put<Result>(this.url, req);
  }

  updateImage(req: UpdateCarrusel): Observable<Result> {
    return this.http.put<Result>(this.url, req);
  }

  deleteImage(req: UpdateCarrusel): Observable<Result> {
    return this.http.delete<Result>(this.url, { body: req });
  }
}
