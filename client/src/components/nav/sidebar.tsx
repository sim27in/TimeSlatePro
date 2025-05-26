import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Calendar, 
  Clock, 
  Settings, 
  CalendarDays, 
  DollarSign, 
  LogOut,
  BarChart3 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Appointments", href: "/appointments", icon: CalendarDays },
  { name: "Services", href: "/services", icon: Settings },
  { name: "Availability", href: "/availability", icon: Clock },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-background dark:bg-background border-r border-border dark:border-border">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calendar className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="text-xl font-bold text-foreground">TimeSlate</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/10"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        {user && (
          <div className="flex items-center space-x-3 mb-4">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.firstName || "User"}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">
                  {user.firstName?.[0] || user.email?.[0] || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.businessName || "Professional"}
              </p>
            </div>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
          <a href="/api/logout">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </a>
        </Button>
      </div>
    </div>
  );
}
