import { storageService } from "./storage.service";

import type {
  CalendarData,
  CalendarEvent,
} from "../types/calendar.types";

export const calendarService = {
  // =========================================
  // GET USER CALENDAR
  // =========================================

  getCalendarForUser(
    userId: string,
    tenantId: string
  ): CalendarData | null {
    const calendars = storageService.getCalendars();

    return (
      calendars.find(
        (calendar) =>
          calendar.ownerId === userId &&
          calendar.tenantId === tenantId
      ) || null
    );
  },

  // =========================================
  // GET TENANT CALENDAR
  // =========================================

  getCalendarForTenant(
    tenantId: string
  ): CalendarData | null {
    const calendars = storageService.getCalendars();

    return (
      calendars.find(
        (calendar) =>
          calendar.tenantId === tenantId
      ) || null
    );
  },

  // =========================================
  // CREATE CALENDAR
  // =========================================

  createCalendar(
    data: Omit<
      CalendarData,
      "id" | "createdAt"
    >
  ): CalendarData {
    const calendars = storageService.getCalendars();

    const newCalendar: CalendarData = {
      ...data,

      id: `calendar-${Date.now()}`,

      createdAt: new Date().toISOString(),
    };

    calendars.push(newCalendar);

    storageService.saveCalendars(calendars);

    return newCalendar;
  },

  // =========================================
  // GET EVENTS
  // =========================================

  getEvents(
    calendarId: string
  ): CalendarEvent[] {
    const events = storageService.getEvents();

    return events.filter(
      (event) =>
        event.calendarId === calendarId
    );
  },

  // =========================================
  // CREATE EVENT
  // =========================================

  createEvent(
    data: Omit<CalendarEvent, "id">
  ): CalendarEvent {
    const events = storageService.getEvents();

    const newEvent: CalendarEvent = {
      ...data,

      id: `event-${Date.now()}`,
    };

    events.push(newEvent);

    storageService.saveEvents(events);

    return newEvent;
  },

  // =========================================
  // UPDATE EVENT
  // =========================================

  updateEvent(
    eventId: string,
    data: Partial<CalendarEvent>
  ): CalendarEvent | null {
    const events = storageService.getEvents();

    const eventIndex = events.findIndex(
      (event) =>
        event.id === eventId
    );

    if (eventIndex === -1) {
      return null;
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...data,
    };

    storageService.saveEvents(events);

    return events[eventIndex];
  },

  // =========================================
  // DELETE EVENT
  // =========================================

  deleteEvent(
    eventId: string
  ): boolean {
    const events = storageService.getEvents();

    const eventExists = events.some(
      (event) =>
        event.id === eventId
    );

    if (!eventExists) {
      return false;
    }

    const remainingEvents = events.filter(
      (event) =>
        event.id !== eventId
    );

    storageService.saveEvents(
      remainingEvents
    );

    return true;
  },
};