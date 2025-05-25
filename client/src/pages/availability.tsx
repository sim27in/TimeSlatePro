import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Availability } from "@shared/schema";
import type { AvailabilitySlot } from "@/lib/types";

const daysOfWeek = [
  { id: 0, name: "Sunday", short: "Sun" },
  { id: 1, name: "Monday", short: "Mon" },
  { id: 2, name: "Tuesday", short: "Tue" },
  { id: 3, name: "Wednesday", short: "Wed" },
  { id: 4, name: "Thursday", short: "Thu" },
  { id: 5, name: "Friday", short: "Fri" },
  { id: 6, name: "Saturday", short: "Sat" },
];

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);

  const { data: availability = [], isLoading } = useQuery<Availability[]>({
    queryKey: ["/api/availability"],
    onSuccess: (data) => {
      // Convert database availability to form format
      const slots = data.map(slot => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
      }));
      setAvailabilitySlots(slots);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (slots: AvailabilitySlot[]) =>
      apiRequest("POST", "/api/availability", slots),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: "Availability updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating availability",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize availability slots if not loaded yet
  if (availabilitySlots.length === 0 && !isLoading) {
    const defaultSlots = daysOfWeek.map(day => ({
      dayOfWeek: day.id,
      startTime: "09:00",
      endTime: "17:00",
      isActive: day.id >= 1 && day.id <= 5, // Monday to Friday default
    }));
    setAvailabilitySlots(defaultSlots);
  }

  const updateSlot = (dayOfWeek: number, field: string, value: any) => {
    setAvailabilitySlots(prev => 
      prev.map(slot => 
        slot.dayOfWeek === dayOfWeek 
          ? { ...slot, [field]: value }
          : slot
      )
    );
  };

  const handleSave = () => {
    const activeSlots = availabilitySlots.filter(slot => slot.isActive);
    updateMutation.mutate(activeSlots);
  };

  const getSlotForDay = (dayOfWeek: number) => {
    return availabilitySlots.find(slot => slot.dayOfWeek === dayOfWeek) || {
      dayOfWeek,
      startTime: "09:00",
      endTime: "17:00",
      isActive: false,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Availability</h1>
              <p className="text-muted-foreground">
                Set your weekly availability for client bookings
              </p>
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>
                Set the days and times when clients can book appointments with you.
                Toggle days on/off and adjust your start and end times.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {daysOfWeek.map((day) => {
                const slot = getSlotForDay(day.id);
                return (
                  <div key={day.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Switch
                        checked={slot.isActive}
                        onCheckedChange={(checked) => 
                          updateSlot(day.id, 'isActive', checked)
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{day.name}</p>
                      </div>
                    </div>
                    
                    {slot.isActive && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => 
                              updateSlot(day.id, 'startTime', e.target.value)
                            }
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => 
                              updateSlot(day.id, 'endTime', e.target.value)
                            }
                            className="w-32"
                          />
                        </div>
                      </div>
                    )}
                    
                    {!slot.isActive && (
                      <div className="text-sm text-muted-foreground">
                        Unavailable
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Additional settings to control how clients can book with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Minimum Notice</label>
                  <p className="text-xs text-muted-foreground">How far in advance must clients book?</p>
                  <Input 
                    type="number" 
                    placeholder="24" 
                    className="mt-1"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Hours (Coming soon)</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Maximum Notice</label>
                  <p className="text-xs text-muted-foreground">How far ahead can clients book?</p>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    className="mt-1"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Days (Coming soon)</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Time Zone</label>
                  <p className="text-xs text-muted-foreground">Your local time zone</p>
                  <Input 
                    placeholder="UTC" 
                    className="mt-1"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
