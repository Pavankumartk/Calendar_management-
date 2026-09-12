import type { DummyUser } from "../types/role.types";

import type {
  CalendarData,
  CalendarEvent,
} from "../types/calendar.types";

const USER_KEY = "calendar_current_user";

const CALENDAR_KEY = "calendar_dummy_calendars";

const EVENT_KEY = "calendar_dummy_events";

export const storageService = {
  // =========================================
  // CURRENT USER
  // =========================================

  getCurrentUser(): DummyUser | null {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = sessionStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as DummyUser;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: DummyUser): void {
    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },

  removeCurrentUser(): void {
    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.removeItem(USER_KEY);
  },

  // =========================================
  // CALENDARS
  // =========================================

  getCalendars(): CalendarData[] {
    if (typeof window === "undefined") {
      return [];
    }

    const storedCalendars =
      localStorage.getItem(CALENDAR_KEY);

    if (!storedCalendars) {
      return [];
    }

    try {
      return JSON.parse(
        storedCalendars
      ) as CalendarData[];
    } catch {
      return [];
    }
  },

  saveCalendars(
    calendars: CalendarData[]
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      CALENDAR_KEY,
      JSON.stringify(calendars)
    );
  },

  // =========================================
  // EVENTS
  // =========================================

  getEvents(): CalendarEvent[] {
    if (typeof window === "undefined") {
      return [];
    }

    const storedEvents =
      localStorage.getItem(EVENT_KEY);

    if (!storedEvents) {
      return [];
    }

    try {
      return JSON.parse(
        storedEvents
      ) as CalendarEvent[];
    } catch {
      return [];
    }
  },

  saveEvents(
    events: CalendarEvent[]
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      EVENT_KEY,
      JSON.stringify(events)
    );
  },
};