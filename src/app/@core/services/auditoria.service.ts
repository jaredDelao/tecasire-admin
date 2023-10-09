import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuditoriaFilters, Log } from '../interfaces/auditoria.models';
import { GenericResp } from '../interfaces/generic.models';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  url: string = `${environment.url}/auditoria`;

  constructor(private http: HttpClient) {}

  getLogs(page: number = 1, count: number = 10, filters?: AuditoriaFilters): Observable<GenericResp<Log>> {
    const clearFilters = _.omitBy(filters, _.isEmpty);

    if (filters?.iIdEmpleado) delete filters.iIdEmpleado;
    const body = new HttpParams({
      fromObject: {
        regxpag: count,
        pagina: page,
        ...clearFilters,
      },
    });
    return this.http.get<GenericResp<Log>>(`${this.url}`, { params: body });
  }
}
