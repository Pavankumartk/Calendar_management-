"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import CalendarSidebar from "@/components/calendar/CalendarSidebar";
import CalendarView from "@/components/calendar/CalendarView";

import { calendarService } from "@/features/calendar/services/calendar.service";

import type {
  CalendarData,
  CalendarEvent,
} from "@/features/calendar/types/calendar.types";

/* ========================================
   LOGIN DATA TYPE
======================================== */

interface LoginData {
  loggedIn: boolean;

  role: string;

  displayRole: string;

  tenantType: string;

  displayTenant: string;

  loginTime: string;
}

/* ========================================
   UNIVERSITY EVENT TYPES
======================================== */

const EVENT_TYPES = [
  "Semester Commencement",
  "Student Induction / Orientation",
  "Commencement of Classes",
  "Class",
  "Lab / Practical",
  "Assignment Deadline",
  "Internal Assessment",
  "Project Review",
  "Seminar / Workshop",
  "Last Working Day",
  "Theory Examination",
  "Practical Examination",
  "Viva Examination",
  "Holiday",
  "College / University Event",
  "Semester Break",
  "Commencement of Next Semester",
  "Other",
];

/* ========================================
   STUDENT DUMMY CALENDAR
======================================== */

const STUDENT_DUMMY_CALENDAR: CalendarData = {
  id: "student-demo-calendar",

  tenantId: "UNIVERSITY",

  ownerId: "TENANT_ADMIN",

  title: "B.Tech CSE - Semester 3 Calendar",

  academicYear: "2026-27",

  programme: "B.Tech",

  branch: "CSE",

  year: "Year 2",

  semester: "Semester 3",

  scheme: "2025 Scheme",

  startDate: "2026-08-01",

  endDate: "2026-12-20",

  createdAt: "2026-08-01T00:00:00.000Z",
};

/* ========================================
   STUDENT DUMMY EVENTS
======================================== */

const STUDENT_DUMMY_EVENTS: CalendarEvent[] = [
  {
    id: "student-event-001",

    calendarId: "student-demo-calendar",

    title: "Data Structures Class",

    eventType: "Class",

    startDate: "2026-09-14",

    endDate: "2026-09-14",

    startTime: "10:00",

    endTime: "11:00",

    audience: "B.Tech CSE - Semester 3",

    description:
      "Regular Data Structures class in Room 204.",

    color: "#4f46e5",
  },

  {
    id: "student-event-002",

    calendarId: "student-demo-calendar",

    title: "DBMS Lab",

    eventType: "Lab / Practical",

    startDate: "2026-09-15",

    endDate: "2026-09-15",

    startTime: "14:00",

    endTime: "16:00",

    audience: "B.Tech CSE - Semester 3",

    description:
      "Database Management Systems practical lab.",

    color: "#8b5cf6",
  },

  {
    id: "student-event-003",

    calendarId: "student-demo-calendar",

    title: "Internal Assessment 1",

    eventType: "Internal Assessment",

    startDate: "2026-09-18",

    endDate: "2026-09-18",

    startTime: "09:30",

    endTime: "10:30",

    audience: "B.Tech CSE - Semester 3",

    description:
      "Internal assessment for Data Structures.",

    color: "#ef4444",
  },

  {
    id: "student-event-004",

    calendarId: "student-demo-calendar",

    title: "Assignment 2 Deadline",

    eventType: "Assignment Deadline",

    startDate: "2026-09-20",

    endDate: "2026-09-20",

    startTime: "",

    endTime: "",

    audience: "B.Tech CSE - Semester 3",

    description:
      "Submit DBMS Assignment 2 before 11:59 PM.",

    color: "#0ea5e9",
  },

  {
    id: "student-event-005",

    calendarId: "student-demo-calendar",

    title: "Python Workshop",

    eventType: "Seminar / Workshop",

    startDate: "2026-09-22",

    endDate: "2026-09-22",

    startTime: "11:00",

    endTime: "13:00",

    audience: "All CSE Students",

    description:
      "Python programming workshop conducted by the CSE department.",

    color: "#10b981",
  },

  {
    id: "student-event-006",

    calendarId: "student-demo-calendar",

    title: "Project Review 1",

    eventType: "Project Review",

    startDate: "2026-09-24",

    endDate: "2026-09-24",

    startTime: "15:00",

    endTime: "16:00",

    audience: "B.Tech CSE - Semester 3",

    description:
      "First review of the semester mini project.",

    color: "#f97316",
  },

  {
    id: "student-event-007",

    calendarId: "student-demo-calendar",

    title: "University Holiday",

    eventType: "Holiday",

    startDate: "2026-09-25",

    endDate: "2026-09-25",

    startTime: "",

    endTime: "",

    audience: "All Students",

    description:
      "University holiday. No classes will be conducted.",

    color: "#f59e0b",
  },

  {
    id: "student-event-008",

    calendarId: "student-demo-calendar",

    title: "Theory Examination",

    eventType: "Theory Examination",

    startDate: "2026-09-28",

    endDate: "2026-09-28",

    startTime: "10:00",

    endTime: "13:00",

    audience: "B.Tech CSE - Semester 3",

    description:
      "Data Structures theory examination.",

    color: "#ef4444",
  },
];

/* ========================================
   PAGE
======================================== */

export default function CalendarManagementPage() {
  const router = useRouter();

  const [loginData, setLoginData] =
    useState<LoginData | null>(null);

  const [calendar, setCalendar] =
    useState<CalendarData | null>(null);

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [editingEvent, setEditingEvent] =
    useState<CalendarEvent | null>(null);

  const [title, setTitle] =
    useState("");

  const [eventType, setEventType] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [audience, setAudience] =
    useState("");

  const [description, setDescription] =
    useState("");

  /* ========================================
     INITIAL LOAD
  ======================================== */

  useEffect(() => {
    const storedLogin =
      localStorage.getItem(
        "calendar_dummy_login"
      );

    if (!storedLogin) {
      router.replace("/sign_in");
      return;
    }

    let parsedLogin: LoginData;

    try {
      parsedLogin =
        JSON.parse(storedLogin);
    } catch {
      router.replace("/sign_in");
      return;
    }

    if (!parsedLogin.loggedIn) {
      router.replace("/sign_in");
      return;
    }

    setLoginData(parsedLogin);

    /* =====================================
       STUDENT DUMMY VIEW
    ====================================== */

    if (
      parsedLogin.role === "LEARNER"
    ) {
      setCalendar(
        STUDENT_DUMMY_CALENDAR
      );

      setEvents(
        STUDENT_DUMMY_EVENTS
      );

      setLoading(false);

      return;
    }

    /* =====================================
       OTHER ROLES
    ====================================== */

    const effectiveTenantId =
      parsedLogin.tenantType === "ALL"
        ? "ALL"
        : parsedLogin.tenantType;

    let foundCalendar =
      calendarService.getCalendarForTenant(
        effectiveTenantId
      );

    /* =====================================
       SUPER ADMIN / PLATFORM ADMIN

       Auto create a general calendar
       if one does not exist.
    ====================================== */

    if (
      !foundCalendar &&
      (
        parsedLogin.role ===
          "SUPER_ADMIN" ||
        parsedLogin.role ===
          "PLATFORM_ADMIN"
      )
    ) {
      foundCalendar =
        calendarService.createCalendar({
          tenantId: "ALL",

          ownerId:
            parsedLogin.role,

          title:
            "Calendar Management",
        });
    }

    setCalendar(foundCalendar);

    if (foundCalendar) {
      setEvents(
        calendarService.getEvents(
          foundCalendar.id
        )
      );
    }

    setLoading(false);
  }, [router]);

  /* ========================================
     ROLE PERMISSIONS
  ======================================== */

  const isStudent =
    loginData?.role === "LEARNER";

  const isSuperAdmin =
    loginData?.role ===
    "SUPER_ADMIN";

  const isPlatformAdmin =
    loginData?.role ===
    "PLATFORM_ADMIN";

  const isTenantAdmin =
    loginData?.role ===
    "TENANT_ADMIN";

  const isCoordinator =
    loginData?.role ===
    "COORDINATOR";

  const isFaculty =
    loginData?.role ===
    "FACULTY";

  /* ========================================
     STUDENT CAN NEVER MANAGE
  ======================================== */

  const canManage =
    !isStudent &&
    (
      isSuperAdmin ||
      isPlatformAdmin ||
      isTenantAdmin ||
      isCoordinator ||
      isFaculty
    );

  /* ========================================
     TENANT HEADER
  ======================================== */

  function getCalendarHeading() {
    if (!loginData) {
      return "Calendar Management";
    }

    if (
      isSuperAdmin ||
      isPlatformAdmin
    ) {
      return "Calendar Management - All Tenants";
    }

    switch (
      loginData.tenantType
    ) {
      case "UNIVERSITY":
        return "University & College Calendar";

      case "SKILL_ACADEMY":
        return "Skill Academy Calendar";

      case "BOOTCAMP":
        return "Bootcamp Calendar";

      case "CORPORATE":
        return "Corporate Calendar";

      default:
        return "Calendar Management";
    }
  }

  /* ========================================
     DESCRIPTION
  ======================================== */

  function getCalendarDescription() {
    if (!loginData) {
      return "";
    }

    if (isStudent) {
      return "View your classes, labs, assessments, assignments, examinations, holidays and scheduled learning activities.";
    }

    if (
      isSuperAdmin ||
      isPlatformAdmin
    ) {
      return "Manage calendars, schedules and events across all tenants.";
    }

    switch (
      loginData.tenantType
    ) {
      case "UNIVERSITY":
        return "Manage classes, exams, labs, assignments, deadlines, holidays and academic events.";

      case "SKILL_ACADEMY":
        return "Manage training sessions, batches, assessments, workshops and certification activities.";

      case "BOOTCAMP":
        return "Manage cohort sessions, coding labs, challenges, assessments, projects and placement activities.";

      case "CORPORATE":
        return "Manage training programmes, compliance sessions, assessments and completion deadlines.";

      default:
        return "Manage scheduled learning activities and events.";
    }
  }

  /* ========================================
     REFRESH EVENTS
  ======================================== */

  function refreshEvents(
    targetCalendar = calendar
  ) {
    if (!targetCalendar) {
      return;
    }

    /*
      Student uses fixed dummy events.
    */

    if (isStudent) {
      setEvents(
        STUDENT_DUMMY_EVENTS
      );

      return;
    }

    setEvents(
      calendarService.getEvents(
        targetCalendar.id
      )
    );
  }

  /* ========================================
     RESET FORM
  ======================================== */

  function resetForm() {
    setEditingEvent(null);

    setTitle("");

    setEventType("");

    setStartDate("");

    setEndDate("");

    setStartTime("");

    setEndTime("");

    setAudience("");

    setDescription("");
  }

  /* ========================================
     OPEN ADD EVENT
  ======================================== */

  function openAddEvent(
    selectedDate?: string
  ) {
    if (
      !canManage ||
      isStudent
    ) {
      return;
    }

    resetForm();

    if (selectedDate) {
      setStartDate(selectedDate);

      setEndDate(selectedDate);
    }

    setShowModal(true);
  }

  /* ========================================
     EVENT CLICK

     Student:
     View only

     Other allowed roles:
     Edit
  ======================================== */

  function openEvent(
    event: CalendarEvent
  ) {
    setEditingEvent(event);

    setTitle(event.title);

    setEventType(
      event.eventType
    );

    setStartDate(
      event.startDate
    );

    setEndDate(
      event.endDate
    );

    setStartTime(
      event.startTime || ""
    );

    setEndTime(
      event.endTime || ""
    );

    setAudience(
      event.audience || ""
    );

    setDescription(
      event.description || ""
    );

    setShowModal(true);
  }

  /* ========================================
     SAVE / UPDATE EVENT
  ======================================== */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    /*
      Student cannot save anything.
    */

    if (
      !calendar ||
      !canManage ||
      isStudent
    ) {
      return;
    }

    if (
      !title ||
      !eventType ||
      !startDate ||
      !endDate
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    if (
      endDate <
      startDate
    ) {
      alert(
        "End Date cannot be before Start Date."
      );

      return;
    }

    if (editingEvent) {
      calendarService.updateEvent(
        editingEvent.id,
        {
          title,

          eventType,

          startDate,

          endDate,

          startTime,

          endTime,

          audience,

          description,

          color:
            editingEvent.color ||
            getEventColor(
              eventType
            ),
        }
      );
    } else {
      calendarService.createEvent({
        calendarId:
          calendar.id,

        title,

        eventType,

        startDate,

        endDate,

        startTime,

        endTime,

        audience,

        description,

        color:
          getEventColor(
            eventType
          ),
      });
    }

    refreshEvents();

    setShowModal(false);

    resetForm();
  }

  /* ========================================
     DELETE EVENT
  ======================================== */

  function handleDelete() {
    if (
      !editingEvent ||
      !canManage ||
      isStudent
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmed) {
      return;
    }

    calendarService.deleteEvent(
      editingEvent.id
    );

    refreshEvents();

    setShowModal(false);

    resetForm();
  }

  /* ========================================
     DRAG / MOVE EVENT
  ======================================== */

  function handleEventMove(
    eventId: string,

    newStartDate: string,

    newEndDate: string
  ) {
    if (
      !canManage ||
      isStudent
    ) {
      return;
    }

    calendarService.updateEvent(
      eventId,
      {
        startDate:
          newStartDate,

        endDate:
          newEndDate,
      }
    );

    refreshEvents();
  }

  /* ========================================
     LOADING
  ======================================== */

  if (
    loading ||
    !loginData
  ) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        Loading Calendar...
      </div>
    );
  }

  /* ========================================
     PAGE UI
  ======================================== */

  return (
    <div
      style={{
        display: "flex",

        minHeight: "100vh",

        background: "#f8fafc",
      }}
    >
      {/* =====================================
          SIDEBAR
      ====================================== */}

      <CalendarSidebar />

      {/* =====================================
          MAIN
      ====================================== */}

      <div
        style={{
          flex: 1,

          minWidth: 0,
        }}
      >
        {/* ===================================
            TOP HEADER
        ==================================== */}

        <header
          style={{
            minHeight: "70px",

            background: "#ffffff",

            borderBottom:
              "1px solid #e5e7eb",

            padding: "0 30px",

            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            gap: "20px",
          }}
        >
          {/* LEFT HEADER */}

          <div>
            <h3
              style={{
                margin: 0,

                fontSize: "18px",
              }}
            >
              {getCalendarHeading()}
            </h3>

            <p
              style={{
                margin:
                  "4px 0 0 0",

                fontSize: "13px",

                color: "#6b7280",
              }}
            >
              {
                loginData.displayTenant
              }
            </p>
          </div>

          {/* RIGHT HEADER */}

          <div
            style={{
              textAlign:
                "right",
            }}
          >
            <strong>
              {
                loginData.displayRole
              }
            </strong>

            {isStudent && (
              <div
                style={{
                  marginTop:
                    "3px",

                  fontSize:
                    "12px",

                  color:
                    "#6b7280",
                }}
              >
                View Only
              </div>
            )}
          </div>
        </header>

        {/* ===================================
            CONTENT
        ==================================== */}

        <main
          style={{
            padding: "30px",
          }}
        >
          {/* =================================
              TITLE / BUTTON
          ================================== */}

          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap: "20px",

              marginBottom:
                "15px",
            }}
          >
            <div>
              <h1
                style={{
                  margin:
                    "0 0 6px 0",

                  fontSize:
                    "28px",
                }}
              >
                {
                  getCalendarHeading()
                }
              </h1>

              <p
                style={{
                  margin: 0,

                  color:
                    "#6b7280",
                }}
              >
                {
                  getCalendarDescription()
                }
              </p>
            </div>

            {/* =================================
                ADD EVENT

                NEVER SHOW FOR STUDENT
            ================================== */}

            {canManage &&
              !isStudent && (
                <button
                  type="button"

                  onClick={() =>
                    openAddEvent()
                  }

                  style={
                    primaryButton
                  }
                >
                  + Add Event
                </button>
              )}
          </div>

          {/* =================================
              CALENDAR INFORMATION
          ================================== */}

          {isStudent && (
            <div
              style={{
                background:
                  "#ffffff",

                border:
                  "1px solid #e5e7eb",

                borderRadius:
                  "10px",

                padding:
                  "14px 18px",

                marginBottom:
                  "20px",

                display:
                  "flex",

                flexWrap:
                  "wrap",

                gap:
                  "20px",

                fontSize:
                  "14px",
              }}
            >
              <span>
                <strong>
                  Academic Year:
                </strong>{" "}
                {
                  STUDENT_DUMMY_CALENDAR.academicYear
                }
              </span>

              <span>
                <strong>
                  Programme:
                </strong>{" "}
                {
                  STUDENT_DUMMY_CALENDAR.programme
                }
              </span>

              <span>
                <strong>
                  Branch:
                </strong>{" "}
                {
                  STUDENT_DUMMY_CALENDAR.branch
                }
              </span>

              <span>
                <strong>
                  Year:
                </strong>{" "}
                {
                  STUDENT_DUMMY_CALENDAR.year
                }
              </span>

              <span>
                <strong>
                  Semester:
                </strong>{" "}
                {
                  STUDENT_DUMMY_CALENDAR.semester
                }
              </span>
            </div>
          )}

          {/* =================================
              PERMISSION INDICATOR
          ================================== */}

          <div
            style={{
              display:
                "inline-block",

              padding:
                "9px 15px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              background:
                isStudent
                  ? "#f3f4f6"
                  : "#dcfce7",

              color:
                isStudent
                  ? "#4b5563"
                  : "#166534",

              fontWeight:
                500,
            }}
          >
            {isStudent
              ? "Student View Only"
              : "✓ Editing Enabled"}
          </div>

          {/* =================================
              CALENDAR
          ================================== */}

          {calendar ? (
            <CalendarView
              events={events}

              /*
                STUDENT:
                false

                Other allowed roles:
                true
              */

              canEdit={
                canManage &&
                !isStudent
              }

              /*
                Student cannot create
                by clicking a date.
              */

              onDateClick={
                isStudent
                  ? undefined
                  : openAddEvent
              }

              /*
                Student CAN click an event
                to view its details.
              */

              onEventClick={
                openEvent
              }

              /*
                Student cannot drag.
              */

              onEventMove={
                isStudent
                  ? undefined
                  : handleEventMove
              }
            />
          ) : (
            <div
              style={{
                background:
                  "#ffffff",

                padding:
                  "40px",

                borderRadius:
                  "12px",

                border:
                  "1px solid #e5e7eb",
              }}
            >
              <h2>
                No Calendar Available
              </h2>

              <p
                style={{
                  color:
                    "#6b7280",
                }}
              >
                There is currently
                no calendar available
                for{" "}
                {
                  loginData.displayTenant
                }
                .
              </p>
            </div>
          )}
        </main>
      </div>

      {/* =====================================
          MODAL
      ====================================== */}

      {showModal && (
        <div
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowModal(
                false
              );

              resetForm();
            }
          }}
          style={{
            position: "fixed",

            inset: 0,

            zIndex: 1000,

            background:
              "rgba(15, 23, 42, 0.45)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding: "20px",
          }}
        >
          <form
            onSubmit={
              handleSubmit
            }
            style={{
              width: "100%",

              maxWidth:
                "560px",

              maxHeight:
                "90vh",

              overflowY:
                "auto",

              background:
                "#ffffff",

              borderRadius:
                "14px",

              padding:
                "26px",

              boxShadow:
                "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            {/* =================================
                MODAL HEADER
            ================================== */}

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "22px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                }}
              >
                {isStudent
                  ? "Event Details"
                  : editingEvent
                    ? "Edit Event"
                    : "Add Event"}
              </h2>

              <button
                type="button"

                onClick={() => {
                  setShowModal(
                    false
                  );

                  resetForm();
                }}

                style={{
                  border:
                    "none",

                  background:
                    "transparent",

                  fontSize:
                    "24px",

                  cursor:
                    "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* =================================
                EVENT NAME
            ================================== */}

            <FormField
              label="Event Name"
            >
              <input
                type="text"

                value={title}

                required={
                  !isStudent
                }

                readOnly={
                  isStudent
                }

                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target.value
                  )
                }

                style={{
                  ...inputStyle,

                  background:
                    isStudent
                      ? "#f9fafb"
                      : "#ffffff",
                }}
              />
            </FormField>

            {/* =================================
                EVENT TYPE
            ================================== */}

            <FormField
              label="Event Type"
            >
              {isStudent ? (
                <input
                  type="text"

                  value={
                    eventType
                  }

                  readOnly

                  style={{
                    ...inputStyle,

                    background:
                      "#f9fafb",
                  }}
                />
              ) : (
                <select
                  required

                  value={
                    eventType
                  }

                  onChange={(
                    event
                  ) =>
                    setEventType(
                      event.target.value
                    )
                  }

                  style={
                    inputStyle
                  }
                >
                  <option value="">
                    Select Event Type
                  </option>

                  {EVENT_TYPES.map(
                    (type) => (
                      <option
                        key={
                          type
                        }

                        value={
                          type
                        }
                      >
                        {
                          type
                        }
                      </option>
                    )
                  )}
                </select>
              )}
            </FormField>

            {/* =================================
                DATES
            ================================== */}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap:
                  "15px",
              }}
            >
              <FormField
                label="Start Date"
              >
                <input
                  type="date"

                  required={
                    !isStudent
                  }

                  value={
                    startDate
                  }

                  readOnly={
                    isStudent
                  }

                  onChange={(
                    event
                  ) =>
                    setStartDate(
                      event.target.value
                    )
                  }

                  style={{
                    ...inputStyle,

                    background:
                      isStudent
                        ? "#f9fafb"
                        : "#ffffff",
                  }}
                />
              </FormField>

              <FormField
                label="End Date"
              >
                <input
                  type="date"

                  required={
                    !isStudent
                  }

                  min={
                    startDate ||
                    undefined
                  }

                  value={
                    endDate
                  }

                  readOnly={
                    isStudent
                  }

                  onChange={(
                    event
                  ) =>
                    setEndDate(
                      event.target.value
                    )
                  }

                  style={{
                    ...inputStyle,

                    background:
                      isStudent
                        ? "#f9fafb"
                        : "#ffffff",
                  }}
                />
              </FormField>
            </div>

            {/* =================================
                TIME
            ================================== */}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap:
                  "15px",
              }}
            >
              <FormField
                label="Start Time"
              >
                <input
                  type="time"

                  value={
                    startTime
                  }

                  readOnly={
                    isStudent
                  }

                  onChange={(
                    event
                  ) =>
                    setStartTime(
                      event.target.value
                    )
                  }

                  style={{
                    ...inputStyle,

                    background:
                      isStudent
                        ? "#f9fafb"
                        : "#ffffff",
                  }}
                />
              </FormField>

              <FormField
                label="End Time"
              >
                <input
                  type="time"

                  value={
                    endTime
                  }

                  readOnly={
                    isStudent
                  }

                  onChange={(
                    event
                  ) =>
                    setEndTime(
                      event.target.value
                    )
                  }

                  style={{
                    ...inputStyle,

                    background:
                      isStudent
                        ? "#f9fafb"
                        : "#ffffff",
                  }}
                />
              </FormField>
            </div>

            {/* =================================
                AUDIENCE
            ================================== */}

            <FormField
              label="Audience"
            >
              <input
                type="text"

                value={
                  audience
                }

                readOnly={
                  isStudent
                }

                onChange={(
                  event
                ) =>
                  setAudience(
                    event.target.value
                  )
                }

                style={{
                  ...inputStyle,

                  background:
                    isStudent
                      ? "#f9fafb"
                      : "#ffffff",
                }}
              />
            </FormField>

            {/* =================================
                DESCRIPTION
            ================================== */}

            <FormField
              label="Description"
            >
              <textarea
                rows={4}

                value={
                  description
                }

                readOnly={
                  isStudent
                }

                onChange={(
                  event
                ) =>
                  setDescription(
                    event.target.value
                  )
                }

                style={{
                  ...inputStyle,

                  resize:
                    "vertical",

                  background:
                    isStudent
                      ? "#f9fafb"
                      : "#ffffff",
                }}
              />
            </FormField>

            {/* =================================
                STUDENT BUTTON
            ================================== */}

            {isStudent ? (
              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "flex-end",

                  marginTop:
                    "24px",
                }}
              >
                <button
                  type="button"

                  onClick={() => {
                    setShowModal(
                      false
                    );

                    resetForm();
                  }}

                  style={
                    primaryButton
                  }
                >
                  Close
                </button>
              </div>
            ) : (
              /* =================================
                 EDIT / ADD BUTTONS
              ================================== */

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  gap:
                    "12px",

                  marginTop:
                    "25px",
                }}
              >
                {/* DELETE */}

                <div>
                  {editingEvent && (
                    <button
                      type="button"

                      onClick={
                        handleDelete
                      }

                      style={{
                        padding:
                          "10px 17px",

                        background:
                          "#fee2e2",

                        color:
                          "#b91c1c",

                        border:
                          "1px solid #fecaca",

                        borderRadius:
                          "7px",

                        cursor:
                          "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",
                  }}
                >
                  {/* CANCEL */}

                  <button
                    type="button"

                    onClick={() => {
                      setShowModal(
                        false
                      );

                      resetForm();
                    }}

                    style={{
                      padding:
                        "10px 17px",

                      background:
                        "#ffffff",

                      border:
                        "1px solid #d1d5db",

                      borderRadius:
                        "7px",

                      cursor:
                        "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  {/* SAVE */}

                  <button
                    type="submit"

                    style={
                      primaryButton
                    }
                  >
                    {editingEvent
                      ? "Update Event"
                      : "Save Event"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

/* ========================================
   FORM FIELD
======================================== */

function FormField({
  label,
  children,
}: {
  label: string;

  children: ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom:
          "16px",
      }}
    >
      <label
        style={{
          display:
            "block",

          marginBottom:
            "7px",

          fontWeight:
            500,

          color:
            "#111827",
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* ========================================
   EVENT COLOUR
======================================== */

function getEventColor(
  eventType: string
) {
  if (
    eventType.includes(
      "Examination"
    ) ||
    eventType.includes(
      "Assessment"
    )
  ) {
    return "#ef4444";
  }

  if (
    eventType ===
    "Holiday"
  ) {
    return "#f59e0b";
  }

  if (
    eventType.includes(
      "Lab"
    )
  ) {
    return "#8b5cf6";
  }

  if (
    eventType.includes(
      "Assignment"
    )
  ) {
    return "#0ea5e9";
  }

  if (
    eventType.includes(
      "Workshop"
    )
  ) {
    return "#10b981";
  }

  if (
    eventType.includes(
      "Project"
    )
  ) {
    return "#f97316";
  }

  return "#4f46e5";
}

/* ========================================
   INPUT STYLE
======================================== */

const inputStyle = {
  width: "100%",

  padding:
    "10px 11px",

  border:
    "1px solid #d1d5db",

  borderRadius:
    "7px",

  outline:
    "none",

  boxSizing:
    "border-box" as const,

  fontSize:
    "14px",
};

/* ========================================
   PRIMARY BUTTON
======================================== */

const primaryButton = {
  padding:
    "10px 18px",

  background:
    "#4f46e5",

  color:
    "#ffffff",

  border:
    "none",

  borderRadius:
    "7px",

  cursor:
    "pointer",

  fontWeight:
    600,
};