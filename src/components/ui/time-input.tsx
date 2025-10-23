'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimeInputProps {
  value?: any;
  onChange?: (value: any) => void;
  hourCycle?: 12 | 24;
  className?: string;
  'data-invalid'?: boolean;
}

export function TimeInput({ 
  value, 
  onChange, 
  hourCycle = 12, 
  className,
  'data-invalid': dataInvalid,
  ...props 
}: TimeInputProps) {
  // Convertir valor a string para mostrar en el input
  const formatTimeValue = (timeValue?: any): string => {
    if (!timeValue) return '';
    
    // Si es un objeto con hour y minute
    if (typeof timeValue === 'object' && timeValue.hour !== undefined) {
      const hour = timeValue.hour;
      const minute = timeValue.minute?.toString().padStart(2, '0') || '00';
      
      if (hourCycle === 12) {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${minute} ${ampm}`;
      }
      
      return `${hour}:${minute}`;
    }
    
    return String(timeValue);
  };

  // Convertir string a objeto con hour y minute
  const parseTimeString = (timeString: string): any => {
    if (!timeString) return null;
    
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return null;
    
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const ampm = match[3]?.toUpperCase();
    
    if (hourCycle === 12 && ampm) {
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    }
    
    return { hour, minute };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = parseTimeString(e.target.value);
    onChange?.(timeValue);
  };

  return (
    <Input
      type="text"
      placeholder={hourCycle === 12 ? "HH:MM AM/PM" : "HH:MM"}
      value={formatTimeValue(value)}
      onChange={handleChange}
      className={cn(
        dataInvalid && "border-destructive focus-visible:ring-destructive",
        className
      )}
      {...props}
    />
  );
}
