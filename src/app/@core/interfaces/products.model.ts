export interface Product {
  identificador?: number;
  iIdProducto?: number;
  sNombre: string;
  sDescripcion: string;
  dPrecioUnitario: number;
  dTasaIva: number;
  iEstatus: number;
  iIdCategoria: number;
  sNombreCategoria: string;
  iIdTipo: number;
  sTipo: string;
  iExistencia: number;
  sUrlImagen: string;
}
