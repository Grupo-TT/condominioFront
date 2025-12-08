export type PersonalInfoFormData = {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: number;
  tipoDocumento:  string;
  numeroDocumento: number;
  correo: string;
};

export type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};