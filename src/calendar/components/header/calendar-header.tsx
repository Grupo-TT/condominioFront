import { Columns, Grid3x3, Grid2x2, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import { UserSelect } from "@/calendar/components/header/user-select";
import { TodayButton } from "@/calendar/components/header/today-button";
import { DateNavigator } from "@/calendar/components/header/date-navigator";

import type { IEvent } from "@/calendar/interfaces";
import type { TCalendarView } from "@/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
  onViewChange?: (view: TCalendarView) => void;
}

export function CalendarHeader({ view, events, onViewChange }: IProps) {
  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex items-center gap-1.5">
        <div className="inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Vista por semana"
                size="icon"
                variant={view === "week" ? "primary" : "outline"}
                className="rounded-l-md [&_svg]:size-5"
                onClick={() => onViewChange?.("week")}
              >
                <Columns strokeWidth={1.8} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vista por semana</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Vista por mes"
                size="icon"
                variant={view === "month" ? "primary" : "outline"}
                className="-ml-px rounded-none [&_svg]:size-5"
                onClick={() => onViewChange?.("month")}
              >
                <Grid2x2 strokeWidth={1.8} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vista por mes</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Vista por año"
                size="icon"
                variant={view === "year" ? "primary" : "outline"}
                className="-ml-px rounded-none [&_svg]:size-5"
                onClick={() => onViewChange?.("year")}
              >
                <Grid3x3 strokeWidth={1.8} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vista por año</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Vista por agenda"
                size="icon"
                variant={view === "agenda" ? "primary" : "outline"}
                className="-ml-px rounded-r-md [&_svg]:size-5"
                onClick={() => onViewChange?.("agenda")}
              >
                <CalendarRange strokeWidth={1.8} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vista por agenda</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <UserSelect />
      </div>
    </div>
  );
}
