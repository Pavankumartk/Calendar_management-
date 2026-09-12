"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import CalendarSidebar from "@/components/calendar/CalendarSidebar";

import { storageService } from "@/features/calendar/services/storage.service";

import { calendarService } from "@/features/calendar/services/calendar.service";

import { permissionService } from "@/features/calendar/services/permission.service";

import type { DummyUser } from "@/features/calendar/types/role.types";

import type { CalendarData } from "@/features/calendar/types/calendar.types";

export default function AddEventPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<DummyUser | null>(
      null
    );

  const [
    calendar,
    setCalendar,
  ] =
    useState<CalendarData | null>(
      null
    );

  const [title, setTitle] =
    useState("");

  const [
    eventType,
    setEventType,
  ] = useState("");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  const [
    startTime,
    setStartTime,
  ] = useState("");

  const [
    endTime,
    setEndTime,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    audience,
    setAudience,
  ] = useState("");

  useEffect(() => {
    const currentUser =
      storageService.getCurrentUser();

    if (!currentUser) {
      router.replace("/sign_in");
      return;
    }

    const permissions =
      permissionService.getPermissions(
        currentUser.role
      );

    if (
      !permissions.canCreateEvent
    ) {
      router.replace(
        "/calendar-management"
      );

      return;
    }

    let foundCalendar:
      | CalendarData
      | null = null;

    if (
      currentUser.role ===
        "SUPER_ADMIN" ||
      currentUser.role ===
        "PLATFORM_ADMIN"
    ) {
      foundCalendar =
        calendarService.getCalendarForTenant(
          currentUser.tenantId
        );
    } else {
      foundCalendar =
        calendarService.getCalendarForUser(
          currentUser.id,
          currentUser.tenantId
        );
    }

    if (!foundCalendar) {
      router.replace(
        "/calendar-management"
      );

      return;
    }

    setUser(currentUser);
    setCalendar(
      foundCalendar
    );
  }, [router]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!calendar) {
      return;
    }

    calendarService.createEvent({
      calendarId:
        calendar.id,

      title,
      eventType,

      startDate,
      endDate,

      startTime,
      endTime,

      description,
      audience,

      color: "#ef4444",
    });

    router.replace(
      "/calendar-management"
    );
  }

  if (!user || !calendar) {
    return (
      <p
        style={{
          padding: "30px",
        }}
      >
        Loading...
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <CalendarSidebar />

      <main
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "650px",
            background: "#fff",
            border:
              "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "30px",
          }}
        >
          <h1>Add Event</h1>

          <p>
            Calendar:{" "}
            {calendar.title}
          </p>

          <div style={groupStyle}>
            <label>
              Event Name *
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              style={fieldStyle}
            />
          </div>

          <div style={groupStyle}>
            <label>
              Event Type *
            </label>

            <select
              required
              value={eventType}
              onChange={(event) =>
                setEventType(
                  event.target.value
                )
              }
              style={fieldStyle}
            >
              <option value="">
                Select Event Type
              </option>

              <option>
                Semester Commencement
              </option>

              <option>
                Student Induction / Orientation
              </option>

              <option>
                Commencement of Classes
              </option>

              <option>
                Class
              </option>

              <option>
                Lab / Practical
              </option>

              <option>
                Assignment Deadline
              </option>

              <option>
                Internal Assessment
              </option>

              <option>
                Project Review
              </option>

              <option>
                Seminar / Workshop
              </option>

              <option>
                Last Working Day
              </option>

              <option>
                Theory Examination
              </option>

              <option>
                Practical Examination
              </option>

              <option>
                Viva Examination
              </option>

              <option>
                Holiday
              </option>

              <option>
                College / University Event
              </option>

              <option>
                Semester Break
              </option>

              <option>
                Commencement of Next Semester
              </option>

              <option>
                Other
              </option>
            </select>
          </div>

          <div style={groupStyle}>
            <label>
              Start Date *
            </label>

            <input
              type="date"
              required
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
              style={fieldStyle}
            />
          </div>

          <div style={groupStyle}>
            <label>
              End Date *
            </label>

            <input
              type="date"
              required
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
              style={fieldStyle}
            />
          </div>

          <div style={groupStyle}>
            <label>
              Start Time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(event) =>
                setStartTime(
                  event.target.value
                )
              }
              style={fieldStyle}
            />
          </div>

          <div style={groupStyle}>
            <label>
              End Time
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(event) =>
                setEndTime(
                  event.target.value
                )
              }
              style={fieldStyle}
            />
          </div>

          <div style={groupStyle}>
            <label>
              Audience
            </label>

            <input
              type="text"
              value={audience}
              onChange={(event) =>
                setAudience(
                  event.target.value
                )
              }
              placeholder="Example: Semester 1 Students"
              style={fieldStyle}
            />
          </div>

          <div style={groupStyle}>
            <label>
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              style={fieldStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                router.back()
              }
            >
              Cancel
            </button>

            <button
              type="submit"
            >
              Save Event
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

const groupStyle = {
  marginBottom: "18px",
};

const fieldStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "7px",
  border:
    "1px solid #d1d5db",
  borderRadius: "7px",
};