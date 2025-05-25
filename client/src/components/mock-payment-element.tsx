import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock } from "lucide-react";

interface MockPaymentElementProps {
  onReady?: () => void;
}

export function MockPaymentElement({ onReady }: MockPaymentElementProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mock Stripe branding */}
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Powered by Stripe (Demo Mode)</span>
      </div>

      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="text-center text-sm text-blue-600 mb-4 font-medium">
            🧪 Demo Mode - No real payment will be processed
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium">
                Card Number
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use 4242 4242 4242 4242 for testing
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-sm font-medium">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                />
              </div>
              <div>
                <Label htmlFor="cvc" className="text-sm font-medium">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={handleCvcChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Cardholder Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              <Select defaultValue="US">
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock useStripe and useElements hooks
export function useMockStripe() {
  return {
    confirmPayment: async (options: any) => {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      return {
        paymentIntent: {
          id: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'succeeded',
        },
        error: null,
      };
    },
  };
}

export function useMockElements() {
  return {
    // Mock elements object
  };
}