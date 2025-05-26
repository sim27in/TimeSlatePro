import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Availability from "@/pages/availability";
import Services from "@/pages/services";
import Appointments from "@/pages/appointments";
import Revenue from "@/pages/revenue";
import BookingPage from "@/pages/book/[slug]";
import Checkout from "@/pages/checkout";
import Sidebar from "@/components/nav/sidebar";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public booking routes */}
      <Route path="/book/:slug" component={BookingPage} />
      <Route path="/checkout" component={Checkout} />
      
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/">
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </Route>
          <Route path="/availability">
            <AuthenticatedLayout>
              <Availability />
            </AuthenticatedLayout>
          </Route>
          <Route path="/services">
            <AuthenticatedLayout>
              <Services />
            </AuthenticatedLayout>
          </Route>
          <Route path="/appointments">
            <AuthenticatedLayout>
              <Appointments />
            </AuthenticatedLayout>
          </Route>
          <Route path="/revenue">
            <AuthenticatedLayout>
              <Revenue />
            </AuthenticatedLayout>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="timeslate-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
