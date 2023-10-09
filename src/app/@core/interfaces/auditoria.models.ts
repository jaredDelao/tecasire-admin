export interface Log {
  fecha: string;
  IdUsuario: string;
  nombre: string;
  perfil: string;
  s_accion: string;
  totreg: number;
}

export interface AuditoriaFilters {
  dfechafin: string;
  dfechainicio: string;
  iIdEmpleado?: number;
}
