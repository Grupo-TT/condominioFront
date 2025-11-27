import { z } from "zod";

// Schema simplificado para editar reservas
export const reservaEditSchema = z.object({
  fechaSolicitud: z.date({ message: "La fecha de inicio es requerida" }),
  horaInicio: z.object({ hour: z.number(), minute: z.number() }, { message: "La hora de inicio es requerida" }),
  endDate: z.date({ message: "La fecha de fin es requerida" }),
  horaFin: z.object({ hour: z.number(), minute: z.number() }, { message: "La hora de fin es requerida" }),
  numeroInvitados: z.number().min(1, "Debe haber al menos 1 invitado").max(100, "Máximo 100 invitados"),
});

export type TReservaEditFormData = z.infer<typeof reservaEditSchema>;

