import { useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import { getEventsCount, navigateDate, rangeText } from "@/calendar/helpers";

import type { IEvent } from "@/calendar/interfaces";
import type { TCalendarView } from "@/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function DateNavigator({ view, events }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();

  const monthLower = format(selectedDate, "MMMM", { locale: es });
  const month = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(() => getEventsCount(events, selectedDate, view), [events, selectedDate, view]);

  const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, "next"));

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
        <Badge variant="outline" className="px-1.5">
          {eventCount} {eventCount === 1 ? 'reserva' : 'reservas'}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="size-6.5 px-0 [&_svg]:size-4.5" onClick={handlePrevious}>
              <ChevronLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Anterior</p>
          </TooltipContent>
        </Tooltip>

        <p className="text-sm text-muted-foreground">{rangeText(view, selectedDate)}</p>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="size-6.5 px-0 [&_svg]:size-4.5" onClick={handleNext}>
              <ChevronRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Siguiente</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
