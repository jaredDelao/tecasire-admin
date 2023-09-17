export interface Discount {
  iIdDescuento: number;
  sDescripcion?: any;
  dMontoMinimo: number;
  dDescuento: number;
  dFechaIni: string;
  dFechaFinAS: string;
  iCategoria: number;
}
export interface DiscountCreate {
  montomin: string;
  descuento: string;
  fechaini: string;
  fechafin: string;
  iIdCategoria: string;
}

export interface DiscountUpdate {
  iIdDescuento: string;
  sDescripcion: string;
  dMontoMinimo: string;
  dDescuento: string;
  iCategoria: string;
  dFechaIni: string;
  dFechaFin: string;
  iIdEmpleado: string;
}
