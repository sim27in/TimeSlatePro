import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertServiceSchema,
  insertAvailabilitySchema,
  insertAppointmentSchema,
} from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Mock Stripe for development if no real keys are provided
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_secret_key";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null; // Will use mock functions when null

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      
      // If updating slug, check if it's unique
      if (updateData.slug) {
        const existingUser = await storage.getUserBySlug(updateData.slug);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Slug is already taken" });
        }
      }
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        ...updateData,
        updatedAt: new Date(),
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Service routes
  app.get('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const services = await storage.getServicesByUserId(userId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        userId,
      });
      
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.patch('/api/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const updateData = req.body;
      
      const service = await storage.updateService(serviceId, updateData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete('/api/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      await storage.deleteService(serviceId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Availability routes
  app.get('/api/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const availability = await storage.getAvailabilityByUserId(userId);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.post('/api/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const availabilityData = req.body;
      
      // Clear existing availability and create new ones
      await storage.clearUserAvailability(userId);
      
      const createdAvailability = [];
      for (const slot of availabilityData) {
        const parsed = insertAvailabilitySchema.parse({
          ...slot,
          userId,
        });
        const availability = await storage.createAvailability(parsed);
        createdAvailability.push(availability);
      }
      
      res.json(createdAvailability);
    } catch (error) {
      console.error("Error updating availability:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid availability data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getAppointmentsByUserId(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/appointments/:id', async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getAppointmentById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      // Get the service details
      const service = await storage.getServiceById(appointment.serviceId);
      
      res.json({ ...appointment, service });
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.patch('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updateData = req.body;
      
      const appointment = await storage.updateAppointment(appointmentId, updateData);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Public Booking Routes (no authentication required)
  app.get('/api/book/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const bookingData = await storage.getBookingData(slug);
      
      if (!bookingData) {
        return res.status(404).json({ message: "Booking page not found" });
      }
      
      res.json(bookingData);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      res.status(500).json({ message: "Failed to load booking page" });
    }
  });

  app.get('/api/book/:slug/availability', async (req, res) => {
    try {
      const { slug } = req.params;
      const { selectedDate } = req.query;
      
      const user = await storage.getUserBySlug(slug);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const availability = await storage.getAvailabilityByUserId(user.id);
      const appointments = selectedDate 
        ? await storage.getAppointmentsByDateRange(user.id, selectedDate as string, selectedDate as string)
        : [];
      
      res.json({ availability, appointments });
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Public booking routes (no auth required)
  app.get('/api/book/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const bookingData = await storage.getBookingData(slug);
      
      if (!bookingData) {
        return res.status(404).json({ message: "Booking page not found" });
      }
      
      res.json(bookingData);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      res.status(500).json({ message: "Failed to fetch booking data" });
    }
  });

  app.get('/api/book/:slug/availability', async (req, res) => {
    try {
      const { slug } = req.params;
      const { date } = req.query;
      
      const user = await storage.getUserBySlug(slug);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user's availability for the requested date
      const availability = await storage.getAvailabilityByUserId(user.id);
      
      // Get existing appointments for the date
      const appointments = await storage.getAppointmentsByDateRange(
        user.id,
        date as string,
        date as string
      );
      
      res.json({ availability, appointments });
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.post('/api/book/:slug/appointment', async (req, res) => {
    try {
      const { slug } = req.params;
      const appointmentData = req.body;
      
      const user = await storage.getUserBySlug(slug);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const service = await storage.getServiceById(appointmentData.serviceId);
      if (!service || service.userId !== user.id) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      const parsed = insertAppointmentSchema.parse({
        ...appointmentData,
        userId: user.id,
        totalAmount: service.price,
      });
      
      const appointment = await storage.createAppointment(parsed);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, appointmentId } = req.body;
      
      if (stripe) {
        // Real Stripe integration
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          metadata: {
            appointmentId: appointmentId?.toString() || '',
          },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } else {
        // Mock payment intent for development
        const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
        res.json({ clientSecret: mockClientSecret });
      }
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, appointmentId } = req.body;
      
      if (stripe) {
        // Real Stripe payment confirmation
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
          await storage.updateAppointment(appointmentId, {
            paymentStatus: 'paid',
            stripePaymentIntentId: paymentIntentId,
          });
          res.json({ success: true });
        } else {
          res.status(400).json({ message: "Payment not confirmed" });
        }
      } else {
        // Mock payment confirmation for development
        if (paymentIntentId.startsWith('pi_mock_')) {
          await storage.updateAppointment(appointmentId, {
            paymentStatus: 'paid',
            stripePaymentIntentId: paymentIntentId,
          });
          res.json({ success: true });
        } else {
          res.status(400).json({ message: "Invalid mock payment intent" });
        }
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
