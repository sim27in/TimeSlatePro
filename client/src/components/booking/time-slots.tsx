import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Service, Availability, Appointment } from "@shared/schema";

interface TimeSlotsProps {
  slug: string;
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  service: Service;
}

interface AvailabilityData {
  availability: Availability[];
  appointments: Appointment[];
}

export default function TimeSlots({ 
  slug, 
  selectedDate, 
  selectedTime, 
  onTimeSelect, 
  service 
}: TimeSlotsProps) {
  const { data, isLoading } = useQuery<AvailabilityData>({
    queryKey: [`/api/book/${slug}/availability`, selectedDate],
    enabled: !!selectedDate,
  });

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>Please select a date first</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Unable to load availability</p>
      </div>
    );
  }

  const { availability, appointments } = data;

  // Get day of week for selected date (0 = Sunday, 1 = Monday, etc.)
  const selectedDateObj = new Date(selectedDate);
  const dayOfWeek = selectedDateObj.getDay();

  // Find availability for this day
  const dayAvailability = availability.filter(slot => 
    slot.dayOfWeek === dayOfWeek && slot.isActive
  );

  if (dayAvailability.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No availability on this day</p>
      </div>
    );
  }

  // Generate time slots
  const generateTimeSlots = (startTime: string, endTime: string, duration: number) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    const current = new Date(start);
    while (current < end) {
      const slotEnd = new Date(current.getTime() + duration * 60000);
      if (slotEnd <= end) {
        slots.push({
          start: current.toTimeString().slice(0, 5),
          end: slotEnd.toTimeString().slice(0, 5),
        });
      }
      current.setTime(current.getTime() + 30 * 60000); // 30-minute intervals
    }
    
    return slots;
  };

  // Get all available time slots for the day
  const allTimeSlots = dayAvailability.flatMap(slot => 
    generateTimeSlots(slot.startTime, slot.endTime, service.duration)
  );

  // Filter out booked slots
  const bookedTimes = appointments.map(apt => apt.startTime);
  const availableSlots = allTimeSlots.filter(slot => 
    !bookedTimes.includes(slot.start)
  );

  // Sort slots by time
  availableSlots.sort((a, b) => a.start.localeCompare(b.start));

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No available time slots</p>
        <p className="text-sm">Try selecting a different date</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {availableSlots.map((slot, index) => (
        <Button
          key={index}
          variant={selectedTime === slot.start ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onTimeSelect(slot.start)}
        >
          {formatTime(slot.start)}
        </Button>
      ))}
    </div>
  );
}
