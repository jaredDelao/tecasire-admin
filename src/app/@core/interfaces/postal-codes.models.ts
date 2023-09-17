export interface PostalCode {
  iIdCodigoPostal: number;
  cp: string;
  sAlcaldia: string;
  sColonia: string;
  dMonto: number;
  totreg: number;
}

export interface PostalCodeUpdate {
  s_alcaldia: string;
  s_codigop: string;
  s_colonia: string;
  d_precio: string;
  iIdCodigoPostal?: string;
}

export interface Address {
  iIdDireccion: number;
  iCodigoPostal: number;
  sCalle: string;
  sColonia: string;
  sDelegacion: string;
  sEstado: string;
  sNumeroExterior: string;
  sNumeroInterior: string;
  sNombrePersonaRecibe: string;
  sApellidoPersonaRecibe: string;
  sTelefono: string;
  sCompania: string;
}
