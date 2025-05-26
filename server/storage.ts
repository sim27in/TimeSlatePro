import {
  users,
  services,
  availability,
  appointments,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type Availability,
  type InsertAvailability,
  type Appointment,
  type InsertAppointment,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Service operations
  getServicesByUserId(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  getServiceById(id: number): Promise<Service | undefined>;
  
  // Availability operations
  getAvailabilityByUserId(userId: string): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, availability: Partial<InsertAvailability>): Promise<Availability>;
  deleteAvailability(id: number): Promise<void>;
  clearUserAvailability(userId: string): Promise<void>;
  
  // Appointment operations
  getAppointmentsByUserId(userId: string): Promise<(Appointment & { service: Service })[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Appointment[]>;
  
  // Booking operations
  getUserBySlug(slug: string): Promise<User | undefined>;
  getBookingData(slug: string): Promise<{ user: User; services: Service[] } | null>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Service operations
  async getServicesByUserId(userId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.userId, userId))
      .orderBy(asc(services.name));
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  // Availability operations
  async getAvailabilityByUserId(userId: string): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(eq(availability.userId, userId))
      .orderBy(asc(availability.dayOfWeek), asc(availability.startTime));
  }

  async createAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const [newAvailability] = await db
      .insert(availability)
      .values(availabilityData)
      .returning();
    return newAvailability;
  }

  async updateAvailability(id: number, availabilityData: Partial<InsertAvailability>): Promise<Availability> {
    const [updatedAvailability] = await db
      .update(availability)
      .set({ ...availabilityData, updatedAt: new Date() })
      .where(eq(availability.id, id))
      .returning();
    return updatedAvailability;
  }

  async deleteAvailability(id: number): Promise<void> {
    await db.delete(availability).where(eq(availability.id, id));
  }

  async clearUserAvailability(userId: string): Promise<void> {
    await db.delete(availability).where(eq(availability.userId, userId));
  }

  // Appointment operations
  async getAppointmentsByUserId(userId: string): Promise<(Appointment & { service: Service })[]> {
    return await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        serviceId: appointments.serviceId,
        clientName: appointments.clientName,
        clientEmail: appointments.clientEmail,
        clientPhone: appointments.clientPhone,
        appointmentDate: appointments.appointmentDate,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        status: appointments.status,
        notes: appointments.notes,
        totalAmount: appointments.totalAmount,
        paymentStatus: appointments.paymentStatus,
        stripePaymentIntentId: appointments.stripePaymentIntentId,
        reminderSent: appointments.reminderSent,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        service: services,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.appointmentDate), desc(appointments.startTime));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      )
      .orderBy(asc(appointments.appointmentDate), asc(appointments.startTime));
  }

  // Booking operations
  async getUserBySlug(slug: string): Promise<User | undefined> {
    // For now, use the user ID directly as the slug
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, slug));
    return user;
  }

  async getBookingData(slug: string): Promise<{ user: User; services: Service[] } | null> {
    const user = await this.getUserBySlug(slug);
    if (!user) return null;

    const userServices = await this.getServicesByUserId(user.id);
    return { user, services: userServices.filter(s => s.isActive) };
  }
}

export const storage = new DatabaseStorage();
