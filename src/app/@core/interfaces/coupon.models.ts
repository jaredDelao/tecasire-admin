export interface Coupon {
  iIdCupon: number;
  sCodigoCupon: string;
  sConcepto: string;
  iIdMotivo: number;
  sMotivo: string;
  iTipoCupon: number;
  sDescripcion: string;
  dMontoMaximo: number;
  dFechaInicio: string;
  dFechaFin: string;
  iEstatus: number;
  totreg: number;
}

export interface UpdateCoupon {
  identificador?: string;
  sCodigoCupon: string;
  sConcepto: string;
  iIdMotivo: string;
  iIdTipo: string;
  dMontoMaximo: string;
  dFechaInicio: string;
  dFechaFin: string;
  iEstatus?: string;
}
