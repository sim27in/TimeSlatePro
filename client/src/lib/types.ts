export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  serviceId: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  upcomingAppointments: number;
  completedAppointments: number;
}
