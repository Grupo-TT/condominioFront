

export interface Usuario {
    primerNombre: string,
    segundoNombre: string | null,
    primerApellido: string,
    segundoApellido: string| null,
    tipoDocumento: string,
    numeroDocumento: number
    correoElectronico: string,
    telefono: number,
    rolEnCasa: string,
    casaAsociada: number,
} // si el usuario está asociado a una casa
