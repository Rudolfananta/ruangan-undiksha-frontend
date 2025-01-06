"use client"

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerWithYearProps {
  onChange?: (date: string | undefined) => void;
  defaultValue?: string;
}

export function DatePickerWithYear({
  className,
  onChange,
  defaultValue
}: DatePickerWithYearProps &  React.HTMLAttributes<HTMLDivElement>) {
  const defaultDate = defaultValue ? new Date(defaultValue) : undefined;
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);
  const [year, setYear] = React.useState<number>(defaultDate?.getFullYear() || new Date().getFullYear());
  const [month, setMonth] = React.useState<number>(defaultDate?.getMonth() || new Date().getMonth());

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i);

  const handleYearChange = (selectedYear: string) => {
    setYear(parseInt(selectedYear))
  }

  const handleMonthChange = (selectedMonth: number) => {
    setMonth(selectedMonth)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-between p-3">
            <Select
              onValueChange={(value: string) => handleMonthChange(parseInt(value))}
              value={month.toString()}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2000, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleYearChange} value={year.toString()}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              onChange?.(newDate ? format(newDate, "yyyy-MM-dd") : undefined);
            }}
            month={new Date(year, month)}
            onMonthChange={(newMonth) => {
              setMonth(newMonth.getMonth())
              setYear(newMonth.getFullYear())
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

