export interface Profile {
  iIdUsrEmpleado: number;
  iIdPerfil: number;
  sCorreo: string;
  sNombreEmpleado: string;
  sApellidoPaterno: string;
  sApellidoMaterno: string;
  sAvatar: string;
  sEstatus: number;
  sDescripcion: string;
}
export interface ProfileRequest {
  nombreemp: string;
  appaterno: string;
  apmaterno: string;
  id_empleado: string;
  typephoto?: string;
  photo?: string;
}
