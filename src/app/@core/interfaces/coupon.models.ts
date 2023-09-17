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
  iIdCupon?: string;
  sCodigoCupon: string;
  sConcepto: string;
  iIdMotivo: string;
  iIdTipoCupon: string;
  dMonto: string;
  dFechaIni: string;
  dFechaFin: string;
  iEstatus?: string;
  iIdEmpleado: string;
}
