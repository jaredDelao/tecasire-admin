import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Log } from '../interfaces/auditoria.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  url: string = `${environment.url}/auditoria`;

  constructor(private http: HttpClient) {}

  getLogs(page: number = 1, count: number = 10): Observable<GenericResp<Log>> {
    return this.http.get<GenericResp<Log>>(this.url + `?regxpag=${count}&pagina=${page}`);
  }
}
