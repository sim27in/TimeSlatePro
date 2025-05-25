import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, Bell, RotateCcw, Share2, BarChart3, CheckCircle, Play } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Set your availability and let clients book automatically based on your real-time schedule.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Integrated Stripe payments with automatic invoicing and revenue tracking.",
    },
    {
      icon: Bell,
      title: "Auto Reminders",
      description: "Automated email reminders reduce no-shows and keep everyone on schedule.",
    },
    {
      icon: RotateCcw,
      title: "Calendar Sync",
      description: "Two-way Google Calendar integration keeps your schedule synchronized everywhere.",
    },
    {
      icon: Share2,
      title: "Shareable Links",
      description: "Custom booking pages with your branding that you can share anywhere.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your revenue, popular services, and booking patterns with detailed insights.",
    },
  ];

  const benefits = [
    "Revenue Tracking: Monitor your earnings with detailed financial reports and trends.",
    "Client Management: Keep track of client history, preferences, and booking patterns.",
    "Performance Insights: Understand which services are most popular and optimize your offerings.",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="text-primary-foreground h-4 w-4" />
                </div>
                <span className="text-xl font-bold text-foreground">TimeSlate</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                <a href="#resources" className="text-muted-foreground hover:text-primary transition-colors">Resources</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/api/login">Sign In</a>
              </Button>
              <Button asChild>
                <a href="/api/login">Get Started Free</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Professional Booking Made <span className="text-primary">Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                TimeSlate helps coaches, therapists, and consultants streamline their booking process with automated scheduling, payments, and client management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild>
                  <a href="/api/login">Start Free Trial</a>
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="text-accent mr-2 h-4 w-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-accent mr-2 h-4 w-4" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional coaching session" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-accent h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Session Booked!</div>
                    <div className="text-xs text-muted-foreground">with Sarah Chen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage bookings
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From availability settings to payment processing, TimeSlate provides all the tools you need to run your service business efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-none">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-primary h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
              alt="Calendar scheduling interface showing booking management" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Business dashboard with analytics and metrics" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Powerful Dashboard & Analytics
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get insights into your business with comprehensive analytics, revenue tracking, and appointment management all in one place.
              </p>
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="text-white h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{benefit.split(':')[0]}</h4>
                      <p className="text-muted-foreground">{benefit.split(':')[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button>Explore Dashboard</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to streamline your bookings?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust TimeSlate to manage their appointments and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/api/login">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6">14-day free trial • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="text-white h-4 w-4" />
                </div>
                <span className="text-xl font-bold">TimeSlate</span>
              </div>
              <p className="text-slate-400 mb-4">Professional booking and scheduling made simple for service providers.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TimeSlate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
