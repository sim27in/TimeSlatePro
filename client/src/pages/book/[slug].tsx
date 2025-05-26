import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Calendar, User } from "lucide-react";
import { useState } from "react";
import BookingCalendar from "@/components/booking/calendar";
import ServiceSelector from "@/components/booking/service-selector";
import TimeSlots from "@/components/booking/time-slots";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@shared/schema";

interface BookingData {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  services: Service[];
}

export default function PublicBookingPage() {
  const [, params] = useRoute("/book/:slug");
  const slug = params?.slug;

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Debug logging
  console.log('Booking state:', { selectedService, selectedDate, selectedTime });

  const { data: bookingData, isLoading, error } = useQuery<BookingData>({
    queryKey: [`/api/book/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Booking Page Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The booking page you're looking for doesn't exist or is no longer available.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, services } = bookingData;
  const activeServices = services.filter(service => service.isActive);

  const handleBookAppointment = () => {
    if (selectedService && selectedDate && selectedTime) {
      // Navigate to checkout with booking details
      const bookingParams = new URLSearchParams({
        serviceId: selectedService.id.toString(),
        date: selectedDate,
        time: selectedTime,
        slug: slug!
      });
      window.location.href = `/checkout?${bookingParams.toString()}`;
    }
  };

  const canProceedToBooking = selectedService && selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Book with {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Professional'}
                </CardTitle>
                <CardDescription className="text-base">
                  Select a service and time that works for you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {activeServices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Services Available</h3>
              <p className="text-muted-foreground">
                This professional hasn't set up any bookable services yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-1">
              <Card className="h-fit card-hover glass dark:glass-dark">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>Select Service</span>
                  </CardTitle>
                  <CardDescription>
                    Choose what you'd like to book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServiceSelector
                    services={activeServices}
                    selectedService={selectedService}
                    onServiceSelect={setSelectedService}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Time Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="card-hover glass dark:glass-dark">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Pick a Date</span>
                  </CardTitle>
                  <CardDescription>
                    Select your preferred date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </CardContent>
              </Card>

              {selectedDate && selectedService && (
                <Card className="card-hover glass dark:glass-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Available Times</span>
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred time slot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TimeSlots
                      slug={slug!}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                      service={selectedService}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {canProceedToBooking && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">Booking Summary</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Service:</strong> {selectedService.name}</p>
                    <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
                    <p><strong>Price:</strong> ${selectedService.price}</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleBookAppointment}
                  className="button-hover"
                >
                  Book & Pay ${selectedService.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}