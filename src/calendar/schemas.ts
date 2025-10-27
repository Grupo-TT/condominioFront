import { z } from "zod";

export const eventSchema = z.object({
  user: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "Start time is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "End time is required" }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"], { required_error: "Color is required" }),
});

export type TEventFormData = z.infer<typeof eventSchema>;

// Schema simplificado para editar reservas
export const reservaEditSchema = z.object({
  startDate: z.date({ required_error: "La fecha de inicio es requerida" }),
  startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "La hora de inicio es requerida" }),
  endDate: z.date({ required_error: "La fecha de fin es requerida" }),
  endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "La hora de fin es requerida" }),
  numeroInvitados: z.number().min(1, "Debe haber al menos 1 invitado").max(100, "Máximo 100 invitados"),
});

export type TReservaEditFormData = z.infer<typeof reservaEditSchema>;
