"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { format, setHours, setMinutes, isBefore, parse } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function TimePicker({
  className,
  value, // Expected format: "HH:mm"
  onChange,
  minTime, // Expected format: "HH:mm"
  deliveryDate, // Date object from DatePicker
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState(() => {
    return value ? value.split(':')[0] : format(new Date(), 'HH');
  });
  const [selectedMinute, setSelectedMinute] = React.useState(() => {
    return value ? value.split(':')[1] : format(new Date(), 'mm');
  });

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value]);

  const generateTimeOptions = React.useCallback(() => {
    const options = [];
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const isTodaySelected = format(deliveryDate || now, 'yyyy-MM-dd') === today;

    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const hourFormatted = hour.toString().padStart(2, '0');
        const minuteFormatted = minute.toString().padStart(2, '0');
        const timeValue = `${hourFormatted}:${minuteFormatted}`;

        let displayHour = hour % 12;
        if (displayHour === 0) displayHour = 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const displayTime = `${displayHour}:${minuteFormatted} ${period}`;

        const currentTime = setMinutes(setHours(deliveryDate || now, hour), minute);
        const minTimeDate = minTime ? parse(minTime, 'HH:mm', deliveryDate || now) : null;

        // Only include times that are not in the past relative to minTime or current time if today
        if (isTodaySelected) {
          if (minTimeDate && isBefore(currentTime, minTimeDate)) {
            continue;
          }
          if (isBefore(currentTime, now)) {
            continue;
          }
        }

        options.push({ value: timeValue, label: displayTime, hour: hourFormatted, minute: minuteFormatted });
      }
    }
    return options;
  }, [minTime, deliveryDate]);

  const timeOptions = React.useMemo(() => generateTimeOptions(), [generateTimeOptions]);

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    const newTime = `${hour}:${selectedMinute}`;
    onChange(newTime);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
    const newTime = `${selectedHour}:${minute}`;
    onChange(newTime);
  };

  const displayValue = value ? format(parse(value, 'HH:mm', new Date()), 'h:mm a') : "Select time";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex gap-2 p-4">
          <Select value={selectedHour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                const hourFormatted = hour.toString().padStart(2, '0');
                const isPast = isBefore(
                  setHours(deliveryDate || new Date(), hour),
                  setHours(new Date(), new Date().getHours())
                );
                const isToday = format(deliveryDate || new Date(), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                if (isToday && isPast) {
                  return null;
                }

                return (
                  <SelectItem key={hourFormatted} value={hourFormatted}>
                    {hourFormatted}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={selectedMinute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {['00', '30'].map((minute) => {
                const isPast = isBefore(
                  setMinutes(setHours(deliveryDate || new Date(), parseInt(selectedHour)), parseInt(minute)),
                  new Date()
                );
                const isToday = format(deliveryDate || new Date(), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const isCurrentHour = parseInt(selectedHour) === new Date().getHours();

                if (isToday && isCurrentHour && isPast) {
                  return null;
                }

                return (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}