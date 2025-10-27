"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, User, Home, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditEventDialog } from "@/calendar/components/dialogs/edit-event-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import type { IEvent } from "@/calendar/interfaces";
import type { IEventExtended } from "@/types/reservas-calendar.types";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const eventExtended = event as IEventExtended;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Solicitante</p>
                <p className="text-sm text-muted-foreground">{event.user.name}</p>
              </div>
            </div>

            {eventExtended.casaNumero && (
              <div className="flex items-start gap-2">
                <Home className="mt-1 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Casa</p>
                  <p className="text-sm text-muted-foreground">Casa {eventExtended.casaNumero}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Fecha de Inicio</p>
                <p className="text-sm text-muted-foreground">{format(startDate, "d 'de' MMMM, yyyy h:mm a", { locale: es })}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Fecha de Fin</p>
                <p className="text-sm text-muted-foreground">{format(endDate, "d 'de' MMMM, yyyy h:mm a", { locale: es })}</p>
              </div>
            </div>

            {eventExtended.numeroInvitados && (
              <div className="flex items-start gap-2">
                <Users className="mt-1 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Número de Invitados</p>
                  <p className="text-sm text-muted-foreground">{eventExtended.numeroInvitados} invitados</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <EditEventDialog event={event}>
              <Button type="button" variant="outline">
                Editar
              </Button>
            </EditEventDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
