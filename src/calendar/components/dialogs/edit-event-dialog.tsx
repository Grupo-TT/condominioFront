"use client";

import { parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useUpdateEvent } from "@/calendar/hooks/use-update-event";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogHeader, DialogClose, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { reservaEditSchema } from "@/calendar/schemas";

import type { IEvent } from "@/calendar/interfaces";
import type { IEventExtended } from "@/types/reservas-calendar.types";
import type { TimeValue } from "react-aria-components";
import type { TReservaEditFormData } from "@/calendar/schemas";
import { editarReserva } from "@/hooks/useReserva";

interface IProps {
  children: React.ReactNode;
  event: IEvent;
}

export function EditEventDialog({ children, event }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const { updateEvent } = useUpdateEvent();
  
  const eventExtended = event as IEventExtended;

  const form = useForm<TReservaEditFormData>({
    resolver: zodResolver(reservaEditSchema),
    defaultValues: {
      fechaSolicitud: parseISO(event.startDate),
      horaInicio: { hour: parseISO(event.startDate).getHours(), minute: parseISO(event.startDate).getMinutes() },
      endDate: parseISO(event.endDate),
      horaFin: { hour: parseISO(event.endDate).getHours(), minute: parseISO(event.endDate).getMinutes() },
      numeroInvitados: eventExtended.numeroInvitados || 1,
    },
  });

  const onSubmit = (values: TReservaEditFormData) => {
    const fechaSolicitudTime = new Date(values.fechaSolicitud);
    fechaSolicitudTime.setHours(values.horaInicio.hour, values.horaInicio.minute);

    const endDateTime = new Date(values.endDate);
    endDateTime.setHours(values.horaFin.hour, values.horaFin.minute);

    updateEvent({
      ...event,
      fechaSolicitud: fechaSolicitudTime.toISOString(),
      endDate: endDateTime.toISOString(),
      numeroInvitados: values.numeroInvitados,
    } as IEventExtended);

    console.log("Fomulario:" ,values)
    editarReserva(event.id ,values)
    console.log("Reserva actualizada con exito", event.description)
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la reserva
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Información del solicitante (solo lectura) */}
            <div className="space-y-2">
              <FormLabel>Solicitante</FormLabel>
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <Avatar className="size-8">
                  <AvatarImage src={event.user.picturePath ?? undefined} alt={event.user.name} />
                  <AvatarFallback className="text-xs">{event.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.user.name}</p>
                  {eventExtended.casaNumero && (
                    <p className="text-xs text-gray-500">Casa {eventExtended.casaNumero}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información del recurso (solo lectura) */}
            <div className="space-y-2">
              <FormLabel>Recurso</FormLabel>
              <div className="p-3 border rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-900">{event.title.replace('Reserva - ', '')}</p>
                {eventExtended.tipoRecurso && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {eventExtended.tipoRecurso === 'Zona' ? 'Zona común' : 'Objeto'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="fechaSolicitud"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="fechaSolicitud">Fecha de Inicio</FormLabel>

                    <FormControl>
                      <SingleDayPicker
                        id="fechaSolicitud"
                        value={field.value}
                        onSelect={date => field.onChange(date as Date)}
                        placeholder="Seleccionar fecha"
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horaInicio"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hora de Inicio</FormLabel>

                    <FormControl>
                      <TimeInput value={field.value} onChange={field.onChange} hourCycle={12} data-invalid={fieldState.invalid} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Fecha de Fin</FormLabel>
                    <FormControl>
                      <SingleDayPicker
                        value={field.value}
                        onSelect={date => field.onChange(date as Date)}
                        placeholder="Seleccionar fecha"
                        data-invalid={fieldState.invalid}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horaFin"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hora de Fin</FormLabel>
                    <FormControl>
                      <TimeInput value={field.value} onChange={field.onChange} hourCycle={12} data-invalid={fieldState.invalid} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="numeroInvitados"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="numeroInvitados">Número de Invitados</FormLabel>

                  <FormControl>
                    <Input
                      id="numeroInvitados"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Número de invitados"
                      data-invalid={fieldState.invalid}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>

          <Button form="event-form" type="submit">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
