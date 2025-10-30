import { useMemo } from "react";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { DayCell } from "@/calendar/components/month-view/day-cell";

import { getCalendarCells, calculateMonthEventPositions } from "@/calendar/helpers";

import type { IEvent } from "@/calendar/interfaces";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar();

  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () => calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate),
    [multiDayEvents, singleDayEvents, selectedDate]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 divide-x bg-gray-100 sticky top-0 z-10">
        {WEEK_DAYS.map(day => (
          <div key={day} className="flex items-center justify-center py-2 bg-gray-100">
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 min-h-0">
        {cells.map(cell => (
          <DayCell key={cell.date.toISOString()} cell={cell} events={allEvents} eventPositions={eventPositions} />
        ))}
      </div>
    </div>
  );
}
