export interface Discount {
  identificador?: number;
  sNombreCategoria?: string;
  iIdDescuento?: number | string;
  sDescripcion?: any;
  dMontoMinimo: number | string;
  dDescuento: number | string;
  dFechaIni: string;
  dFechaFinAS?: string;
  dFechaFin?: string;
  iCategoria: number | string;
}
