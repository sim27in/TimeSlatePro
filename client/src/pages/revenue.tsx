import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Users } from "lucide-react";
import type { Appointment, Service } from "@shared/schema";

interface AppointmentWithService extends Appointment {
  service: Service;
}

export default function Revenue() {
  const { data: appointments = [], isLoading } = useQuery<AppointmentWithService[]>({
    queryKey: ["/api/appointments"],
  });

  const paidAppointments = appointments.filter(apt => apt.paymentStatus === 'paid');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  // Calculate revenue metrics
  const totalRevenue = paidAppointments.reduce((sum, apt) => 
    sum + parseFloat(apt.totalAmount || "0"), 0
  );

  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
  
  const thisMonthRevenue = paidAppointments
    .filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.getMonth() === thisMonth.getMonth() && 
             aptDate.getFullYear() === thisMonth.getFullYear();
    })
    .reduce((sum, apt) => sum + parseFloat(apt.totalAmount || "0"), 0);

  const lastMonthRevenue = paidAppointments
    .filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.getMonth() === lastMonth.getMonth() && 
             aptDate.getFullYear() === lastMonth.getFullYear();
    })
    .reduce((sum, apt) => sum + parseFloat(apt.totalAmount || "0"), 0);

  const growthRate = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  // Service performance
  const serviceStats = appointments.reduce((acc, apt) => {
    if (apt.paymentStatus === 'paid') {
      const serviceId = apt.serviceId;
      if (!acc[serviceId]) {
        acc[serviceId] = {
          service: apt.service,
          revenue: 0,
          bookings: 0,
        };
      }
      acc[serviceId].revenue += parseFloat(apt.totalAmount || "0");
      acc[serviceId].bookings += 1;
    }
    return acc;
  }, {} as Record<number, { service: Service; revenue: number; bookings: number }>);

  const sortedServices = Object.values(serviceStats)
    .sort((a, b) => b.revenue - a.revenue);

  // Recent transactions
  const recentTransactions = paidAppointments
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
    .slice(0, 10);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Revenue</h1>
            <p className="text-muted-foreground">
              Track your earnings and business performance
            </p>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  All time earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(thisMonthRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Bookings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paidAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedAppointments.length} completed sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(paidAppointments.length > 0 ? totalRevenue / paidAppointments.length : 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per appointment
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Revenue breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                {sortedServices.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No revenue data yet</h3>
                    <p className="text-muted-foreground">
                      Start booking sessions to see your service performance.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedServices.map(({ service, revenue, bookings }) => (
                      <div key={service.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {bookings} booking{bookings !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(revenue)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(revenue / bookings)} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest paid appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No transactions yet</h3>
                    <p className="text-muted-foreground">
                      Completed appointments will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">{transaction.clientName}</p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.service.name}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.appointmentDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm text-green-600">
                            +{formatCurrency(parseFloat(transaction.totalAmount))}
                          </p>
                        </div>
                      </div>
                    ))}
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
