import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, Clock, User, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MockPaymentElement, useMockStripe, useMockElements } from "@/components/mock-payment-element";
import type { Appointment, Service } from "@shared/schema";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const VITE_STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_mock_stripe_public_key";
const stripePromise = loadStripe(VITE_STRIPE_PUBLIC_KEY);

interface AppointmentWithService extends Appointment {
  service: Service;
}

const CheckoutForm = ({ appointment }: { appointment: AppointmentWithService }) => {
  const isRealStripe = import.meta.env.VITE_STRIPE_PUBLIC_KEY && !import.meta.env.VITE_STRIPE_PUBLIC_KEY.includes('mock');
  const stripe = isRealStripe ? useStripe() : useMockStripe();
  const elements = isRealStripe ? useElements() : useMockElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmPaymentMutation = useMutation({
    mutationFn: (data: { paymentIntentId: string; appointmentId: number }) =>
      apiRequest("POST", "/api/confirm-payment", data),
    onSuccess: () => {
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been confirmed. You'll receive a confirmation email shortly.",
      });
      // Redirect to success page or back to booking page
      setTimeout(() => {
        window.location.href = `/book/${appointment.userId}?success=true`;
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Confirmation Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
      } as any);

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        confirmPaymentMutation.mutate({
          paymentIntentId: paymentIntent.id,
          appointmentId: appointment.id,
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">
            Review your appointment details and complete payment to confirm your booking.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Appointment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Appointment Details
              </CardTitle>
              <CardDescription>Please review your booking information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Details */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{appointment.service.name}</h3>
                {appointment.service.description && (
                  <p className="text-muted-foreground text-sm mb-3">{appointment.service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {appointment.service.duration} minutes
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${appointment.totalAmount}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Client Information */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Client Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{appointment.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{appointment.clientEmail}</span>
                  </div>
                  {appointment.clientPhone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{appointment.clientPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {appointment.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                      {appointment.notes}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary">${appointment.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Secure payment processing powered by Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {isRealStripe ? <PaymentElement /> : <MockPaymentElement />}
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p className="text-muted-foreground">
                        {isRealStripe 
                          ? "Your payment information is encrypted and secure. We never store your card details."
                          : "This is a demo environment. No real payment will be processed."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!stripe || isProcessing || confirmPaymentMutation.isPending}
                >
                  {isProcessing || confirmPaymentMutation.isPending 
                    ? "Processing Payment..." 
                    : `Pay $${appointment.totalAmount} & Confirm Booking`
                  }
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By completing your purchase, you agree to our terms of service.
                  You'll receive a confirmation email once payment is processed.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  // Get appointment ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('appointmentId');
    if (id) {
      setAppointmentId(parseInt(id));
    }
  }, []);

  // Fetch appointment details
  const { data: appointment, isLoading: appointmentLoading } = useQuery<AppointmentWithService>({
    queryKey: [`/api/appointments/${appointmentId}`],
    enabled: !!appointmentId,
  });

  // Create payment intent
  useEffect(() => {
    if (appointment && appointment.paymentStatus === 'pending') {
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: parseFloat(appointment.totalAmount),
        appointmentId: appointment.id 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
        });
    }
  }, [appointment]);

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center pt-6">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h1 className="text-2xl font-bold text-foreground mt-4">Invalid Checkout</h1>
            <p className="text-muted-foreground mt-2">
              No appointment ID provided. Please start the booking process again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (appointmentLoading || !appointment) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (appointment.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center pt-6">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="text-2xl font-bold text-foreground mt-4">Payment Complete</h1>
            <p className="text-muted-foreground mt-2">
              This appointment has already been paid for and confirmed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm appointment={appointment} />
    </Elements>
  );
}
