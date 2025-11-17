import type { TEventColor } from "@/calendar/types";
import { RecursoComun, Reserva } from "@/types/reserva.types";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
  correo?: string;
}

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  user: IUser;
  recursoComun: RecursoComun;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
