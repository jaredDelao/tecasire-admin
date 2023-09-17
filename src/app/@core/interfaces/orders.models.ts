export interface Order {
  iIdPedido: number;
  dFechaPedido: string;
  iTipoPedido: number;
  nombre: string;
  num_piezas?: any;
  total?: any;
  fact_pdf?: any;
  fact_xml?: any;
  totreg: number;
  items: number;
  iEstatusPedido: number;
  sEstatusPedido: string;
}

export interface OrderDetail {
  iIdProducto: number;
  sDescripcion: string;
  sNombreCategoria: string;
  dPrecioUnitario: number;
  dSubtotal: number;
  dIva: number;
  dCantidad: number;
  dTasaIva: number;
}

export interface OrderDetailData {
  subtotal: string;
  dDescuento?: any;
  sMetodoPago: string;
  iIdCuponUsuario?: any;
  sDescripcion?: any;
  dCostoEnvio: number;
  dir: string;
}
