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

  categorias(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(this.url + '?catname=cat_categorias');
  }

  perfilesUsuario(): Observable<GenericResp<PerfilUsuario>> {
    return this.http.get<GenericResp<PerfilUsuario>>(`${this.url}/perfiles`, {
      params: this.params,
    });
  }

  tipoPedidos(): Observable<TipoPedidos[]> {
    return this.http.get<TipoPedidos[]>(this.url + '?catname=cat_tipo_pedidos');
  }

  estatusPedidos(): Observable<EstatusPedidos[]> {
    return this.http.get<EstatusPedidos[]>(this.url + '?catname=cat_estatus_pedidos');
  }

  tiposCupones(): Observable<TiposCupon[]> {
    return this.http.get<TiposCupon[]>(this.url + '?catname=cat_tipocupones');
  }

  motivosCupones(): Observable<MotivosCupon[]> {
    return this.http.get<MotivosCupon[]>(this.url + '?catname=cat_motivoscupones');
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
