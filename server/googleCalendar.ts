// Mock Google Calendar Integration
// This simulates the Google Calendar API for development and demo purposes

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  description?: string;
}

interface MockCalendarResponse {
  events: CalendarEvent[];
  nextPageToken?: string;
}

export class MockGoogleCalendar {
  // Simulate checking for conflicts with existing calendar events
  async checkAvailability(startTime: string, endTime: string): Promise<boolean> {
    // Mock some existing events to simulate real calendar conflicts
    const mockExistingEvents = [
      {
        start: "2025-05-27T14:00:00Z",
        end: "2025-05-27T15:00:00Z",
        summary: "Team Meeting"
      },
      {
        start: "2025-05-28T10:00:00Z", 
        end: "2025-05-28T11:30:00Z",
        summary: "Client Call"
      }
    ];

    // Check if requested time conflicts with existing events
    const requestStart = new Date(startTime);
    const requestEnd = new Date(endTime);

    for (const event of mockExistingEvents) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      // Check for overlap
      if (requestStart < eventEnd && requestEnd > eventStart) {
        console.log(`Calendar conflict detected with: ${event.summary}`);
        return false;
      }
    }

    return true;
  }

  // Simulate creating a calendar event
  async createEvent(eventData: {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
    attendeeEmail?: string;
  }): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: `mock_event_${Date.now()}`,
      summary: eventData.summary,
      start: { dateTime: eventData.startTime },
      end: { dateTime: eventData.endTime },
      description: eventData.description
    };

    console.log('Mock Calendar Event Created:', {
      title: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
      attendee: eventData.attendeeEmail
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return event;
  }

  // Simulate getting calendar events for a date range
  async getEvents(startDate: string, endDate: string): Promise<MockCalendarResponse> {
    // Mock events that would be returned from Google Calendar
    const mockEvents: CalendarEvent[] = [
      {
        id: "mock_1",
        summary: "Morning Workout",
        start: { dateTime: "2025-05-27T07:00:00Z" },
        end: { dateTime: "2025-05-27T08:00:00Z" },
        description: "Personal fitness routine"
      },
      {
        id: "mock_2", 
        summary: "Team Standup",
        start: { dateTime: "2025-05-27T14:00:00Z" },
        end: { dateTime: "2025-05-27T14:30:00Z" },
        description: "Daily team sync"
      },
      {
        id: "mock_3",
        summary: "Client Consultation - Sarah",
        start: { dateTime: "2025-05-27T16:00:00Z" },
        end: { dateTime: "2025-05-27T17:00:00Z" },
        description: "Business strategy session"
      }
    ];

    return {
      events: mockEvents
    };
  }

  // Simulate updating an existing calendar event
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    console.log(`Mock Calendar Event Updated: ${eventId}`, updates);
    
    return {
      id: eventId,
      summary: updates.summary || "Updated Event",
      start: updates.start || { dateTime: new Date().toISOString() },
      end: updates.end || { dateTime: new Date(Date.now() + 3600000).toISOString() },
      description: updates.description
    };
  }

  // Simulate deleting a calendar event
  async deleteEvent(eventId: string): Promise<void> {
    console.log(`Mock Calendar Event Deleted: ${eventId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Simulate checking calendar sync status
  async getSyncStatus(): Promise<{ connected: boolean; lastSync: string; eventsCount: number }> {
    return {
      connected: true,
      lastSync: new Date().toISOString(),
      eventsCount: 12
    };
  }
}

export const mockGoogleCalendar = new MockGoogleCalendar();