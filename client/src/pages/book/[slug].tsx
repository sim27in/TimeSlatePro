import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ServiceSelector from "@/components/booking/service-selector";
import BookingCalendar from "@/components/booking/calendar";
import TimeSlots from "@/components/booking/time-slots";
import type { SharedUser, Service } from "@shared/schema";
import type { BookingFormData } from "@/lib/types";

const bookingSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().optional(),
  notes: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingData {
  user: SharedUser;
  services: Service[];
}

export default function BookingPage() {
  const [, params] = useRoute("/book/:slug");
  const slug = params?.slug;
  const { toast } = useToast();

  // Booking state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    },
  });

  // Fetch booking page data
  const {
    data: bookingData,
    isLoading,
    error,
  } = useQuery<BookingData>({
    queryKey: [`/api/book/${slug}`],
    enabled: !!slug,
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: (data: BookingFormData) =>
      apiRequest("POST", `/api/book/${slug}/appointment`, data),
    onSuccess: (response) => {
      const appointment = response.json();
      // Redirect to checkout with appointment ID
      window.location.href = `/checkout?appointmentId=${appointment.id}`;
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  const onSubmit = (data: BookingForm) => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Incomplete booking",
        description: "Please select a service, date, and time",
        variant: "destructive",
      });
      return;
    }

    const endTime = calculateEndTime(selectedTime, selectedService.duration);

    const bookingData: BookingFormData = {
      serviceId: selectedService.id,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone || undefined,
      appointmentDate: selectedDate,
      startTime: selectedTime,
      endTime,
      notes: data.notes || undefined,
    };

    createAppointmentMutation.mutate(bookingData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center pt-6">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h1 className="text-2xl font-bold text-foreground mt-4">
              Booking Page Not Found
            </h1>
            <p className="text-muted-foreground mt-2">
              This booking page doesn't exist or has been disabled.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, services } = bookingData;

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center pt-6">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h1 className="text-2xl font-bold text-foreground mt-4">
              No Services Available
            </h1>
            <p className="text-muted-foreground mt-2">
              This provider hasn't set up any bookable services yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
              <AvatarImage
                src={user.profileImageUrl || ""}
                alt={user.firstName || "Professional"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {user.firstName?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {user.firstName
                  ? `${user.firstName} ${user.lastName || ""}`.trim()
                  : user.businessName || "Professional"}
              </h1>
              <p className="text-muted-foreground">
                {user.businessName ||
                  user.description ||
                  "Professional Services"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Select a Service
                </CardTitle>
                <CardDescription>
                  Choose the type of session you'd like to book
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceSelector
                  services={services}
                  selectedService={selectedService}
                  onServiceSelect={setSelectedService}
                />
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            {selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Select Date & Time
                  </CardTitle>
                  <CardDescription>
                    Pick your preferred date and available time slot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Select Date</h4>
                      <BookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Available Times</h4>
                      <TimeSlots
                        slug={slug!}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                        service={selectedService}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client Information */}
            {selectedService && selectedDate && selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Your Information
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="clientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your full name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="clientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="clientPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any specific topics or questions you'd like to discuss?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={createAppointmentMutation.isPending}
                      >
                        {createAppointmentMutation.isPending
                          ? "Booking..."
                          : `Book Appointment - $${selectedService.price}`}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>
                  Review your appointment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{selectedService.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedService.description}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {selectedService.duration} minutes
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary">
                          ${selectedService.price}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDate && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {new Date(
                        `2000-01-01T${selectedTime}`,
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                )}

                {selectedService && (
                  <div className="flex items-center justify-between py-2 border-t border-border font-semibold">
                    <span>Total:</span>
                    <span className="text-lg text-primary">
                      ${selectedService.price}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
