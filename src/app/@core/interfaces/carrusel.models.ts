export interface Carrusel {
  url: string;
  posicion: number;
  type_img: string;
}

export interface UpdateCarrusel {
  iIdEmpleado: string;
  typephoto: string;
  posicion: string;
  nombrecarrusel: 'Inicio';
  photo?: string;
}
