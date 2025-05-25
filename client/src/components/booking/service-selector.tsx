import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
}

export default function ServiceSelector({ 
  services, 
  selectedService, 
  onServiceSelect 
}: ServiceSelectorProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card 
          key={service.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedService?.id === service.id 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => onServiceSelect(service)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                {service.description && (
                  <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDuration(service.duration)}
                  </div>
                  {service.bufferTime > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{service.bufferTime}m buffer
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="flex items-center text-primary">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xl font-bold">{service.price}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
