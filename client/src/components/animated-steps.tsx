import { Calendar, Users, CreditCard, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  delay: number;
}

function AnimatedStep({ icon, title, description, isActive, delay }: StepProps) {
  return (
    <div className={`
      relative p-6 rounded-2xl backdrop-blur-sm border transition-all duration-700 card-hover
      ${isActive 
        ? 'bg-primary/5 border-primary/20 shadow-lg scale-105' 
        : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50'
      }
    `}
    style={{ animationDelay: `${delay}ms` }}>
      
      {/* Animated Icon Container */}
      <div className={`
        w-16 h-16 rounded-xl mb-4 flex items-center justify-center transition-all duration-500
        ${isActive 
          ? 'bg-primary text-white shadow-lg transform rotate-3' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }
      `}>
        <div className={`transform transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Animated Progress Indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-b-2xl">
          <div className="h-full bg-primary rounded-b-2xl animate-pulse"></div>
        </div>
      )}

      {/* Floating Elements */}
      {isActive && (
        <>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping opacity-75"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
        </>
      )}
    </div>
  );
}

export default function AnimatedSteps() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Set Your Availability",
      description: "Define when you're available for appointments with flexible scheduling options and buffer times."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Share Your Booking Link",
      description: "Clients book directly through your personalized booking page - no back-and-forth emails needed."
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Get Paid Instantly",
      description: "Secure payments processed automatically through Stripe when clients book their appointments."
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Stay Organized",
      description: "Automatic calendar sync and reminders keep you and your clients perfectly coordinated."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <AnimatedStep
          key={index}
          icon={step.icon}
          title={step.title}
          description={step.description}
          isActive={activeStep === index}
          delay={index * 200}
        />
      ))}
    </div>
  );
}