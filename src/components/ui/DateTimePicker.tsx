"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) {
      setDate(undefined);
      return;
    }
    
    const newDate = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate(),
      date?.getHours() ?? 0,
      date?.getMinutes() ?? 0
    );
    setDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-right font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {date ? (
            format(date, "PPP HH:mm", { locale: ar })
          ) : (
            <span>اختر تاريخًا ووقتًا</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => {
            handleDateSelect(day);
          }}
          initialFocus
          locale={ar}
        />
        <div className="p-3 border-t border-border">
          <Input
            type="time"
            onChange={handleTimeChange}
            value={date ? format(date, "HH:mm") : ""}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}