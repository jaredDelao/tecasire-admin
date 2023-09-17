import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Log } from '../interfaces/auditoria.models';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  url: string = environment.url + '/auditoria';

  constructor(private http: HttpClient) {}

  getLogs(page: string = '1', count: string = '10'): Observable<Log[]> {
    return this.http.get<Log[]>(this.url + `?regxpag=${count}&pagina=${page}`);
  }
}
