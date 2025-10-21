export interface Usuario {
    id?: number;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    correoElectronico: string;
    telefono: string;
    rolEnCasa: string;
    casaAsociada: string;
  }
  