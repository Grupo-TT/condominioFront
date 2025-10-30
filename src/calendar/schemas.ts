import { z } from "zod";

export const eventSchema = z.object({
  user: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ message: "Start date is required" }),
  startTime: z.object({ hour: z.number(), minute: z.number() }),
  endDate: z.date({ message: "End date is required" }),
  endTime: z.object({ hour: z.number(), minute: z.number() }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"]),
});

export type TEventFormData = z.infer<typeof eventSchema>;

// Schema simplificado para editar reservas
export const reservaEditSchema = z.object({
  startDate: z.date({ message: "La fecha de inicio es requerida" }),
  startTime: z.object({ hour: z.number(), minute: z.number() }),
  endDate: z.date({ message: "La fecha de fin es requerida" }),
  endTime: z.object({ hour: z.number(), minute: z.number() }),
  numeroInvitados: z.number().min(1, "Debe haber al menos 1 invitado").max(100, "Máximo 100 invitados"),
});

export type TReservaEditFormData = z.infer<typeof reservaEditSchema>;
