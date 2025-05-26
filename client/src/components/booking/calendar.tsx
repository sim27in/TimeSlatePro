import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());

  const days = [];
  const currentDate = new Date(startOfCalendar);
  
  // Generate 42 days (6 weeks) to fill the calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isSelected = (date: Date) => {
    return selectedDate === date.toISOString().split('T')[0];
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;
    const dateString = date.toISOString().split('T')[0];
    console.log('Date clicked:', dateString); // Debug log
    onDateSelect(dateString);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-background dark:bg-background border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={previousMonth}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-foreground text-lg">
          {formatDate(currentMonth)}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={nextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isPast = isPastDate(date);
          const isCurrent = isCurrentMonth(date);
          const isToday_ = isToday(date);
          const isSelected_ = isSelected(date);

          return (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isPast) {
                  handleDateClick(date);
                }
              }}
              disabled={isPast}
              className="h-10 w-full text-sm rounded-md transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer font-bold text-[#fafafa] bg-[#1e1e1e]"
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
