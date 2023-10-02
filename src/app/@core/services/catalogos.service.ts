import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import {
  Catalogo,
  EstatusPedidos,
  MotivosCupon,
  PerfilUsuario,
  TipoPedidos,
  TiposCupon,
} from '../interfaces/categoria.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  url: string = environment.url + '/catalogos';

  constructor(private http: HttpClient) {}

  categorias(): Observable<GenericResp<Catalogo>> {
    return this.http.get<GenericResp<Catalogo>>(`${this.url}/categorias`, {
      params: this.params,
    });
  }

  perfilesUsuario(): Observable<GenericResp<PerfilUsuario>> {
    return this.http.get<GenericResp<PerfilUsuario>>(`${this.url}/perfiles`, {
      params: this.params,
    });
  }

  tipoPedidos(): Observable<GenericResp<TipoPedidos>> {
    return this.http.get<GenericResp<TipoPedidos>>(`${this.url}/tipopedidos`, {
      params: this.params,
    });
  }

  estatusPedidos(): Observable<GenericResp<EstatusPedidos>> {
    return this.http.get<GenericResp<EstatusPedidos>>(`${this.url}/estatuspedidos`, {
      params: this.params,
    });
  }

  tiposCupones(): Observable<GenericResp<TiposCupon>> {
    return this.http.get<GenericResp<TiposCupon>>(`${this.url}/tipocupones`, {
      params: this.params,
    });
  }

  motivosCupones(): Observable<GenericResp<MotivosCupon>> {
    return this.http.get<GenericResp<MotivosCupon>>(`${this.url}/motivoscupones`, {
      params: this.params,
    });
  }

  get params() {
    return new HttpParams({
      fromObject: {
        regxpag: 100,
        pagina: 1,
      },
    });
  }
}
