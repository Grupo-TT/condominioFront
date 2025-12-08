import type { RecursoComun } from './reserva.types'

export type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray";

export interface IUser {
  id: string;
  name: string;
  email?: string;
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

