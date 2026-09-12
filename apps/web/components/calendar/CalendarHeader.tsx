"use client";

import Link from "next/link";

interface CalendarHeaderProps {
  title?: string;
  subtitle?: string;
  onAddEvent?: () => void;
  showAddEvent?: boolean;
}

export default function CalendarHeader({
  title = "Calendar Management",
  subtitle = "Manage calendars and events",
  onAddEvent,
  showAddEvent = false,
}: CalendarHeaderProps) {
  return (
    <header className="calendar-header">
      <div>
        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>

      <div className="calendar-header-actions">
        <Link
          href="/calendar-management/create-calendar"
          className="secondary-button"
        >
          + Create Calendar
        </Link>

        {showAddEvent &&
          onAddEvent && (
            <button
              type="button"
              className="primary-button"
              onClick={
                onAddEvent
              }
            >
              + Add Event
            </button>
          )}
      </div>
    </header>
  );
}