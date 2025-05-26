import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Shield,
  Bell,
  Smartphone,
  Play,
  Chrome,
  Zap,
  Globe,
  CreditCard,
} from "lucide-react";
import { SiGooglecalendar, SiStripe } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                TimeSlate
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Reviews
              </a>
              <ThemeToggle />
              <Button
                variant="outline"
                asChild
                className="border-primary/20 hover:bg-primary/5"
              >
                <a href="/api/login">Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>Trusted by 5,000+ solo professionals</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                The Smarter Way to{" "}
                <span className="text-gradient">Schedule Sessions</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                TimeSlate helps coaches, consultants, and freelancers accept
                bookings with ease, sync calendars, and get paid — all in one
                tool.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90 shadow-lg"
                  asChild
                >
                  <a href="/api/login">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800/50"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <SiStripe className="h-5 w-5 text-primary" />
                  <span>Secure payments via Stripe</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <SiGooglecalendar className="h-5 w-5 text-primary" />
                  <span>Google Calendar sync</span>
                </div>
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative">
              <div className="relative bg-card dark:bg-card border rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Today's Schedule</h3>
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-background dark:bg-background/50 rounded-lg p-3 flex items-center space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">
                          Coaching Session • 10:00 AM
                        </p>
                      </div>
                    </div>
                    <div className="bg-background dark:bg-background/50 rounded-lg p-3 flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Mike Chen</p>
                        <p className="text-xs text-muted-foreground">
                          Consultation • 2:30 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50 dark:bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works: A Step-by-Step Guide
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get up and running in minutes with our simple setup process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up with Google or Email",
                description:
                  "Create your account in seconds with secure authentication",
                icon: Users,
              },
              {
                step: "2",
                title: "Set Your Availability",
                description:
                  "Define when you're available for bookings with flexible scheduling",
                icon: Calendar,
              },
              {
                step: "3",
                title: "Share Your Booking Link",
                description:
                  "Get a personalized booking page to share with clients",
                icon: Globe,
              },
              {
                step: "4",
                title: "Get Paid and Notified",
                description:
                  "Receive payments instantly and get automated notifications",
                icon: Bell,
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    {item.step}
                  </div>
                  <item.icon className="h-6 w-6 absolute -bottom-1 -right-1 bg-background dark:bg-background border-2 border-primary rounded-full p-1" />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why TimeSlate?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to run your booking business professionally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Secure Payments via Stripe",
                description:
                  "Accept payments instantly with industry-leading security and global support.",
              },
              {
                icon: Bell,
                title: "Smart Reminders for Clients",
                description:
                  "Automated email and SMS reminders reduce no-shows and keep everyone on schedule.",
              },
              {
                icon: SiGooglecalendar,
                title: "Calendar Sync with Google",
                description:
                  "Two-way sync prevents double bookings and keeps your schedule perfectly organized.",
              },
              {
                icon: Zap,
                title: "Custom Session Types",
                description:
                  "Create unlimited service types with different durations, prices, and descriptions.",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="border-primary/10 hover:border-primary/30 transition-colors group"
              >
                <CardHeader className="text-center space-y-4">
                  <div className="h-12 w-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/50 dark:bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Solo Pros Are Saying
            </h2>
            <p className="text-muted-foreground text-lg">
              Real feedback from professionals who've transformed their business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Executive Coach",
                avatar: "SC",
                content:
                  "TimeSlate transformed how I manage my coaching practice. The booking process is now seamless and my clients love the professional experience.",
              },
              {
                name: "Mike Rodriguez",
                role: "Business Consultant",
                avatar: "MR",
                content:
                  "The payment integration is fantastic. I get paid faster and my clients appreciate the smooth checkout process. Highly recommend!",
              },
              {
                name: "Emma Thompson",
                role: "Wellness Therapist",
                avatar: "ET",
                content:
                  "Finally, a booking system that understands solo professionals. The automated reminders alone have reduced my no-shows by 80%.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-primary/10">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Simple Pricing for Growing Professionals
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-4xl font-bold pt-4">
                  {"$0"}
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Up to 50 bookings/month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Basic calendar sync
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Email reminders
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    TimeSlate branding
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/api/login">Get Started</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For growing professionals</CardDescription>
                <div className="text-4xl font-bold pt-4">
                  $29
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Unlimited bookings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Payment processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Custom branding
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    SMS reminders
                  </li>
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <a href="/api/login">Start Free Trial</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For established businesses</CardDescription>
                <div className="text-4xl font-bold pt-4">
                  $99
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Team management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    White-label solution
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/api/login">Contact Sales</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Start Scheduling Today
            </h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              Join thousands of professionals who've streamlined their booking
              process with TimeSlate. No setup fees, no long-term contracts,
              cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <a href="/api/login">
                  Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white/30 text-white hover:bg-white/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 dark:bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">TimeSlate</span>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                The modern booking platform designed specifically for solo
                professionals. Streamline your scheduling, get paid faster, and
                grow your business.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p>&copy; 2024 TimeSlate. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm">
                Made for solo professionals worldwide
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
