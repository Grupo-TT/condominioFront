import { format } from "date-fns";
import { es } from "date-fns/locale";

import { useCalendar } from "@/calendar/contexts/calendar-context";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function TodayButton() {
  const { setSelectedDate } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="flex size-14 flex-col items-start overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={handleClick}
        >
          <p className="flex h-6 w-full items-center justify-center bg-primary text-center text-xs font-semibold text-primary-foreground">
            {format(today, "MMM", { locale: es }).toUpperCase()}
          </p>
          <p className="flex w-full items-center justify-center text-lg font-bold">{today.getDate()}</p>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Ir a hoy</p>
      </TooltipContent>
    </Tooltip>
  );
}
