import { Calendar, Clock, User, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnimatedCalendar() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Main Calendar */}
      <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 card-hover">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gray-900 dark:text-white">TimeSlate</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">March 2025</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 6;
            const isToday = day === 15;
            const hasBooking = [12, 18, 22, 25].includes(day);
            
            return (
              <div
                key={i}
                className={`
                  text-xs text-center py-1 rounded
                  ${day < 1 || day > 31 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                  ${isToday ? 'bg-primary text-white' : ''}
                  ${hasBooking ? 'bg-primary/10 text-primary font-medium' : ''}
                `}
              >
                {day > 0 && day <= 31 ? day : ''}
              </div>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Available Times</div>
          <div className="grid grid-cols-3 gap-2">
            {['9:00 AM', '2:00 PM', '4:00 PM'].map((time, i) => (
              <div
                key={time}
                className={`
                  text-xs py-2 px-3 rounded-lg text-center transition-all duration-500
                  ${step === 1 && i === 1 ? 'bg-primary text-white scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                `}
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Booking Notification */}
      <div className={`
        absolute -top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg
        transform transition-all duration-500 flex items-center space-x-2
        ${step === 3 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
      `}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Booked!</span>
      </div>

      {/* Client Avatar */}
      <div className={`
        absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-full
        flex items-center justify-center shadow-lg
        transform transition-all duration-500
        ${step >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
      `}>
        <User className="h-6 w-6 text-white" />
      </div>

      {/* Animated Clock */}
      <div className={`
        absolute top-4 -left-8 w-10 h-10 bg-blue-500 rounded-full
        flex items-center justify-center shadow-lg
        transform transition-all duration-500 animate-pulse
        ${step === 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
      `}>
        <Clock className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}