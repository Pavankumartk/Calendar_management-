"use client";

import {
  useEffect,
  useState,
} from "react";

import AudienceSelector from "./AudienceSelector";

// ========================================
// ORIGINAL MEMBER 2 IMPORT
// ========================================

// import { eventTypes } from "@/features/calendar/data/event-types";

// ========================================
// TEMPORARY MOCK IMPORT
// ========================================

import {
  mockEventTypes as eventTypes,
} from "@/mock/calendar.mock";

interface AddEventFormProps {
  calendarId: string;
  tenantType: string;
  selectedDate?: string;
  onSubmit: (
    data: any
  ) => void;
  onCancel: () => void;
}

export default function AddEventForm({
  calendarId,
  tenantType,
  selectedDate,
  onSubmit,
  onCancel,
}: AddEventFormProps) {
  const [
    formData,
    setFormData,
  ] = useState<any>({
    name: "",
    eventType: "",
    startDate:
      selectedDate || "",
    endDate:
      selectedDate || "",
    startTime: "",
    endTime: "",
    allDay: false,
    description: "",
    organizer: "",
    location: "",
    mode: "Offline",
    meetingLink: "",
    recurrence: "NONE",
    reminder: "NONE",
    attendanceRequired: false,
    color: "#2563eb",
    status: "DRAFT",
    audience: {
      type:
        "ENTIRE_TENANT",
    },
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(
        (previous: any) => ({
          ...previous,
          startDate:
            selectedDate,
          endDate:
            selectedDate,
        })
      );
    }
  }, [selectedDate]);

  const handleChange = (
    key: string,
    value: any
  ) => {
    setFormData(
      (previous: any) => ({
        ...previous,
        [key]: value,
      })
    );
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      calendarId,
      tenantType,
    });
  };

  const tenantEventTypes =
    eventTypes[
      tenantType as keyof typeof eventTypes
    ] || [];

  return (
    <form
      className="calendar-form event-form"
      onSubmit={
        handleSubmit
      }
    >
      <h2>
        Add Event
      </h2>

      <div className="form-field">
        <label>
          Event Name *
        </label>

        <input
          type="text"
          value={
            formData.name
          }
          onChange={(
            event
          ) =>
            handleChange(
              "name",
              event.target.value
            )
          }
          required
        />
      </div>

      <div className="form-field">
        <label>
          Event Type *
        </label>

        <select
          value={
            formData.eventType
          }
          onChange={(
            event
          ) =>
            handleChange(
              "eventType",
              event.target.value
            )
          }
          required
        >
          <option value="">
            Select Event Type
          </option>

          {tenantEventTypes.map(
            (type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            )
          )}
        </select>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>
            Start Date *
          </label>

          <input
            type="date"
            value={
              formData.startDate
            }
            onChange={(
              event
            ) =>
              handleChange(
                "startDate",
                event.target.value
              )
            }
            required
          />
        </div>

        <div className="form-field">
          <label>
            End Date *
          </label>

          <input
            type="date"
            value={
              formData.endDate
            }
            onChange={(
              event
            ) =>
              handleChange(
                "endDate",
                event.target.value
              )
            }
            required
          />
        </div>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={
            formData.allDay
          }
          onChange={(
            event
          ) =>
            handleChange(
              "allDay",
              event.target.checked
            )
          }
        />

        All Day
      </label>

      {!formData.allDay && (
        <div className="form-row">
          <div className="form-field">
            <label>
              Start Time
            </label>

            <input
              type="time"
              value={
                formData.startTime
              }
              onChange={(
                event
              ) =>
                handleChange(
                  "startTime",
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-field">
            <label>
              End Time
            </label>

            <input
              type="time"
              value={
                formData.endTime
              }
              onChange={(
                event
              ) =>
                handleChange(
                  "endTime",
                  event.target.value
                )
              }
            />
          </div>
        </div>
      )}

      <div className="form-field">
        <label>
          Description
        </label>

        <textarea
          value={
            formData.description
          }
          onChange={(
            event
          ) =>
            handleChange(
              "description",
              event.target.value
            )
          }
        />
      </div>

      <div className="form-field">
        <label>
          Organizer / Owner
        </label>

        <input
          value={
            formData.organizer
          }
          onChange={(
            event
          ) =>
            handleChange(
              "organizer",
              event.target.value
            )
          }
        />
      </div>

      <div className="form-field">
        <label>
          Location
        </label>

        <input
          value={
            formData.location
          }
          onChange={(
            event
          ) =>
            handleChange(
              "location",
              event.target.value
            )
          }
        />
      </div>

      <div className="form-field">
        <label>Mode</label>

        <select
          value={
            formData.mode
          }
          onChange={(
            event
          ) =>
            handleChange(
              "mode",
              event.target.value
            )
          }
        >
          <option>
            Online
          </option>
          <option>
            Offline
          </option>
          <option>
            Hybrid
          </option>
        </select>
      </div>

      <div className="form-field">
        <label>
          Meeting Link
        </label>

        <input
          type="url"
          value={
            formData.meetingLink
          }
          onChange={(
            event
          ) =>
            handleChange(
              "meetingLink",
              event.target.value
            )
          }
        />
      </div>

      <div className="form-field">
        <label>
          Recurrence
        </label>

        <select
          value={
            formData.recurrence
          }
          onChange={(
            event
          ) =>
            handleChange(
              "recurrence",
              event.target.value
            )
          }
        >
          <option value="NONE">
            Does Not Repeat
          </option>

          <option value="DAILY">
            Daily
          </option>

          <option value="WEEKLY">
            Weekly
          </option>

          <option value="MONTHLY">
            Monthly
          </option>
        </select>
      </div>

      <div className="form-field">
        <label>
          Reminder
        </label>

        <select
          value={
            formData.reminder
          }
          onChange={(
            event
          ) =>
            handleChange(
              "reminder",
              event.target.value
            )
          }
        >
          <option value="NONE">
            No Reminder
          </option>

          <option value="15_MINUTES">
            15 Minutes Before
          </option>

          <option value="30_MINUTES">
            30 Minutes Before
          </option>

          <option value="1_HOUR">
            1 Hour Before
          </option>

          <option value="1_DAY">
            1 Day Before
          </option>
        </select>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={
            formData.attendanceRequired
          }
          onChange={(
            event
          ) =>
            handleChange(
              "attendanceRequired",
              event.target.checked
            )
          }
        />

        Attendance Required
      </label>

      <AudienceSelector
        tenantType={
          tenantType
        }
        value={
          formData.audience
        }
        onChange={(
          audience
        ) =>
          handleChange(
            "audience",
            audience
          )
        }
      />

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={
            onCancel
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="secondary-button"
          onClick={() =>
            handleChange(
              "status",
              "DRAFT"
            )
          }
        >
          Save Draft
        </button>

        <button
          type="submit"
          className="primary-button"
          onClick={() =>
            handleChange(
              "status",
              "PUBLISHED"
            )
          }
        >
          Publish
        </button>
      </div>
    </form>
  );
}