export interface PostalCode {
  iIdCostoEnvioCp?: number;
  cp: string;
  dMonto: number;
  sAlcaldia: string;
  sColonia: string;
  identificador?: number;
}

export interface Address {
  iIdDireccion: number;
  iCodigoPostal: number;
  sCalle: string;
  sColonia: string;
  sDelegacion: string;
  sEstado: string;
  sMunicipio: string;
  sNumeroExterior: string;
  sNumeroInterior: string;
  sNombrePersonaRecibe: string;
  sApellidoPersonaRecibe: string;
  sTelefono: string;
  sCompania: string;
}
