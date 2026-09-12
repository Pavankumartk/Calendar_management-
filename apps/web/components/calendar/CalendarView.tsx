"use client";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import timeGridPlugin from "@fullcalendar/timegrid";

import interactionPlugin from "@fullcalendar/interaction";

import type { CalendarEvent } from "@/features/calendar/types/calendar.types";

interface CalendarViewProps {
  events: CalendarEvent[];

  canEdit: boolean;

  onDateClick?: (
    date: string
  ) => void;

  onEventClick?: (
    event: CalendarEvent
  ) => void;

  onEventMove?: (
    eventId: string,
    startDate: string,
    endDate: string
  ) => void;
}

function addOneDay(
  dateString: string
) {
  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  date.setDate(
    date.getDate() + 1
  );

  return date
    .toISOString()
    .slice(0, 10);
}

function subtractOneDay(
  dateString: string
) {
  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  date.setDate(
    date.getDate() - 1
  );

  return date
    .toISOString()
    .slice(0, 10);
}

export default function CalendarView({
  events,
  canEdit,
  onDateClick,
  onEventClick,
  onEventMove,
}: CalendarViewProps) {
  const fullCalendarEvents =
    events.map(
      (event) => {
        const isTimed =
          Boolean(
            event.startTime
          );

        if (isTimed) {
          return {
            id: event.id,

            title:
              event.title,

            start: `${event.startDate}T${event.startTime}`,

            end:
              event.endTime
                ? `${event.endDate}T${event.endTime}`
                : undefined,

            backgroundColor:
              event.color ||
              "#4f46e5",

            borderColor:
              event.color ||
              "#4f46e5",

            extendedProps: {
              originalEvent:
                event,
            },
          };
        }

        return {
          id: event.id,

          title:
            event.title,

          start:
            event.startDate,

          // FullCalendar treats
          // all-day end date as exclusive.
          end:
            event.endDate
              ? addOneDay(
                  event.endDate
                )
              : undefined,

          allDay: true,

          backgroundColor:
            event.color ||
            "#4f46e5",

          borderColor:
            event.color ||
            "#4f46e5",

          extendedProps: {
            originalEvent:
              event,
          },
        };
      }
    );

  return (
    <div
      style={{
        background:
          "#ffffff",

        border:
          "1px solid #e5e7eb",

        borderRadius:
          "12px",

        padding:
          "20px",
      }}
    >
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left:
            "today prev,next",

          center:
            "title",

          right:
            "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today:
            "Today",

          month:
            "Month",

          week:
            "Week",

          day:
            "Day",
        }}
        events={
          fullCalendarEvents
        }
        selectable={
          canEdit
        }
        editable={
          canEdit
        }
        eventStartEditable={
          canEdit
        }
        eventDurationEditable={
          canEdit
        }
        dayMaxEvents={
          true
        }
        weekends={
          true
        }
        height="auto"
        dateClick={(
          info
        ) => {
          if (
            !canEdit
          ) {
            return;
          }

          onDateClick?.(
            info.dateStr
          );
        }}
        eventClick={(
          info
        ) => {
          const originalEvent =
            info.event
              .extendedProps
              .originalEvent as CalendarEvent;

          onEventClick?.(
            originalEvent
          );
        }}
        eventDrop={(
          info
        ) => {
          if (
            !canEdit
          ) {
            info.revert();

            return;
          }

          const startDate =
            info.event
              .startStr
              .slice(0, 10);

          let endDate =
            startDate;

          if (
            info.event.endStr
          ) {
            const rawEnd =
              info.event
                .endStr
                .slice(
                  0,
                  10
                );

            endDate =
              info.event
                .allDay
                ? subtractOneDay(
                    rawEnd
                  )
                : rawEnd;
          }

          onEventMove?.(
            info.event.id,
            startDate,
            endDate
          );
        }}
      />
    </div>
  );
}