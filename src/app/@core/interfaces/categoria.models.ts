export interface Catalogo {
  iIdCategoria: number;
  sNombreCategoria: string;
  sUrlImagen?: any;
  iEstatus: number;
}

export interface PerfilUsuario {
  iIdPerfil: number;
  sDescripcion: string;
}

export interface TipoPedidos {
  iIdTipoPedido: number;
  sTipoPedido: string;
}

export interface EstatusPedidos {
  iIdEstatusPedido: number;
  sEstatusPedido: string;
}

export interface TiposCupon {
  iTipoCupon: number;
  sDescripcion: string;
}

export interface MotivosCupon {
  iIdMotivo: number;
  sEstatusPedido: string;
}
