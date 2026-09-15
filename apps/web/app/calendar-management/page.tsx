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
   EVENT TYPES BY ROLE / TENANT
======================================== */

const SUPER_ADMIN_EVENT_TYPES = [
  "Platform-Wide Announcement",
  "Platform Governance Review",
  "Policy Update",
  "Compliance Review",
  "Security Audit",
  "Platform Release",
  "System Upgrade",
  "Maintenance Window",
  "Data Migration / Backup",
  "Platform Leadership Review",
  "Billing / Subscription Review",
  "Other",
];

const PLATFORM_ADMIN_EVENT_TYPES = [
  "Platform Configuration",
  "Feature Release",
  "Maintenance Window",
  "Security Update",
  "Integration Deployment",
  "Data Sync / Migration",
  "Platform Training",
  "Support Review",
  "SLA Review",
  "System Audit",
  "Platform Announcement",
  "Other",
];

const UNIVERSITY_EVENT_TYPES = [
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

const SKILL_ACADEMY_EVENT_TYPES = [
  "Batch Commencement",
  "Learner Orientation",
  "Course Session",
  "Live Class",
  "Hands-on Lab",
  "Assignment Deadline",
  "Skill Assessment",
  "Project Review",
  "Workshop / Masterclass",
  "Mentor Session",
  "Mock Interview",
  "Certification Assessment",
  "Placement Drive",
  "Academy Event",
  "Holiday",
  "Batch Break",
  "Batch Completion",
  "Other",
];

const BOOTCAMP_EVENT_TYPES = [
  "Cohort Kickoff",
  "Learner Orientation",
  "Live Class",
  "Coding Lab",
  "Challenge / Assignment Deadline",
  "Weekly Assessment",
  "Project Sprint",
  "Code Review",
  "Hackathon",
  "Mentor Session",
  "Mock Interview",
  "Career Session",
  "Demo Day",
  "Placement Interview",
  "Holiday",
  "Cohort Break",
  "Cohort Graduation",
  "Other",
];

const CORPORATE_EVENT_TYPES = [
  "Training Program Kickoff",
  "Employee Orientation",
  "Instructor-Led Training",
  "Virtual Training Session",
  "Workshop",
  "Compliance Training",
  "Mandatory Training Deadline",
  "Assessment",
  "Certification",
  "Manager Review",
  "Team Learning Session",
  "Leadership Session",
  "Town Hall",
  "Policy / Process Update",
  "Holiday",
  "Training Completion",
  "Other",
];

function getEventTypesForContext(
  loginData: LoginData | null
) {
  if (!loginData) {
    return UNIVERSITY_EVENT_TYPES;
  }

  if (loginData.role === "SUPER_ADMIN") {
    return SUPER_ADMIN_EVENT_TYPES;
  }

  if (loginData.role === "PLATFORM_ADMIN") {
    return PLATFORM_ADMIN_EVENT_TYPES;
  }

  switch (loginData.tenantType) {
    case "SKILL_ACADEMY":
      return SKILL_ACADEMY_EVENT_TYPES;

    case "BOOTCAMP":
      return BOOTCAMP_EVENT_TYPES;

    case "CORPORATE":
      return CORPORATE_EVENT_TYPES;

    case "UNIVERSITY":
    default:
      return UNIVERSITY_EVENT_TYPES;
  }
}



type EventDataPoint = {
  key: string;
  label: string;
  placeholder?: string;
};

function getEventMarkerColor(eventIndex: number) {
  // Must match CalendarView's color calculation.
  const hue = (eventIndex * 137.508) % 360;

  return `hsl(${hue}, 72%, 45%)`;
}

const DATA_POINT_DROPDOWN_OPTIONS: Record<string, string[]> = {
  "All Day": ["Yes", "No"],
  "Priority": ["Low", "Medium", "High", "Critical"],
  "Notification": ["Enable", "Disable"],
  "Reminder": ["15 min", "30 min", "1 hr", "1 day", "Custom"],
  "Status": ["Draft", "Scheduled", "Published", "Cancelled"],
  "Mandatory Event": ["Yes", "No"],
  "Acknowledgement Required": ["Yes", "No"],
  "Registration Required": ["Yes", "No"],
  "Attendance Required": ["Yes", "No"],
  "Academic Year": ["2025-26", "2026-27", "2027-28", "2028-29"],
  "Semester": [
    "Semester 1", "Semester 2", "Semester 3", "Semester 4",
    "Semester 5", "Semester 6", "Semester 7", "Semester 8"
  ],
  "Degree": ["UG", "PG", "Diploma", "Certificate"],
  "Phase": ["Foundation", "Core", "Advanced", "Capstone"],
  "Training Track": ["Foundation", "Intermediate", "Advanced", "Specialization"],
};

function getDropdownOptionsForDataPoint(
  dataPoint: EventDataPoint
): string[] | null {
  return (
    DATA_POINT_DROPDOWN_OPTIONS[dataPoint.label] ||
    null
  );
}

const PLATFORM_COMMON_DATA_POINTS: EventDataPoint[] = [
  { key: "priority", label: "Priority", placeholder: "Low / Medium / High / Critical" },
  { key: "organizer", label: "Organizer" },
];

const SUPER_ADMIN_EXTRA_DATA_POINTS: EventDataPoint[] = [
];

const PLATFORM_ADMIN_EXTRA_DATA_POINTS: EventDataPoint[] = [
  { key: "registrationRequired", label: "Registration Required", placeholder: "Yes / No" },
  { key: "participantLimit", label: "Participant Limit" },
  { key: "attendanceRequired", label: "Attendance Required", placeholder: "Yes / No" },
];

const ROLE_TENANT_DATA_POINTS: Record<string, Record<string, EventDataPoint[]>> = {
  UNIVERSITY: {
    TENANT_ADMIN: ["Campus", "School / College", "Department", "Program", "Degree", "Academic Year", "Semester", "Batch / Cohort", "Section", "Course", "Subject"].map((label) => ({ key: label, label })),
    COORDINATOR: ["Department", "Program", "Academic Year", "Semester", "Batch / Cohort", "Section", "Course", "Subject", "Faculty", "Student Group"].map((label) => ({ key: label, label })),
    FACULTY: ["Department", "Program", "Semester", "Batch", "Section", "Course", "Subject", "Class / Student Group"].map((label) => ({ key: label, label })),
    LEARNER: ["Program", "Semester", "Batch", "Section", "Enrolled Course / Subject", "Student Club / Group"].map((label) => ({ key: label, label })),
  },
  SKILL_ACADEMY: {
    TENANT_ADMIN: ["Academy / Center", "Skill Domain", "Program", "Course", "Batch / Cohort", "Training Track", "Trainer", "Learner Group"].map((label) => ({ key: label, label })),
    COORDINATOR: ["Center", "Skill Domain", "Program", "Course", "Batch", "Training Track", "Trainer", "Learner Group"].map((label) => ({ key: label, label })),
    FACULTY: ["Program", "Course", "Batch", "Module", "Session", "Learner Group"].map((label) => ({ key: label, label })),
    LEARNER: ["Enrolled Program", "Course", "Batch", "Module", "Learner Group"].map((label) => ({ key: label, label })),
  },
  BOOTCAMP: {
    TENANT_ADMIN: ["Bootcamp Program", "Track", "Cohort", "Batch", "Module", "Phase", "Instructor / Mentor", "Learner Group"].map((label) => ({ key: label, label })),
    COORDINATOR: ["Program", "Track", "Cohort", "Batch", "Module", "Phase", "Instructor / Mentor", "Learner Group"].map((label) => ({ key: label, label })),
    FACULTY: ["Assigned Program", "Cohort", "Batch", "Module", "Session", "Learner Group"].map((label) => ({ key: label, label })),
    LEARNER: ["Enrolled Bootcamp", "Track", "Cohort", "Module", "Project / Group"].map((label) => ({ key: label, label })),
  },
  CORPORATE: {
    TENANT_ADMIN: ["Business Unit", "Department", "Location / Branch", "Team", "Job Role / Designation", "Employee Group", "Training Program", "Course", "Batch / Cohort", "Manager"].map((label) => ({ key: label, label })),
    COORDINATOR: ["Business Unit", "Department", "Team", "Employee Group", "Training Program", "Course", "Batch", "Trainer", "Manager"].map((label) => ({ key: label, label })),
    FACULTY: ["Training Program", "Course", "Batch", "Module", "Session", "Employee / Learner Group"].map((label) => ({ key: label, label })),
    LEARNER: ["Assigned Training Program", "Course", "Batch", "Module", "Team"].map((label) => ({ key: label, label })),
  },
};

function getDataPointsForContext(loginData: LoginData | null): EventDataPoint[] {
  if (!loginData) return [];
  if (loginData.role === "SUPER_ADMIN") {
    return [...PLATFORM_COMMON_DATA_POINTS, ...SUPER_ADMIN_EXTRA_DATA_POINTS];
  }
  if (loginData.role === "PLATFORM_ADMIN") {
    return [...PLATFORM_COMMON_DATA_POINTS, ...PLATFORM_ADMIN_EXTRA_DATA_POINTS];
  }
  return ROLE_TENANT_DATA_POINTS[loginData.tenantType]?.[loginData.role] || [];
}

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

  const [eventDataPoints, setEventDataPoints] =
    useState<Record<string, string>>({});


  const [showAttachmentOptions, setShowAttachmentOptions] =
    useState(false);

  const [attachmentType, setAttachmentType] =
    useState("");

  const [attachmentValue, setAttachmentValue] =
    useState("");


  const [openActionEventId, setOpenActionEventId] =
    useState<string | null>(null);

  const [showPublishModal, setShowPublishModal] =
    useState(false);

  const [publishEvent, setPublishEvent] =
    useState<CalendarEvent | null>(null);

  const [publishStartDate, setPublishStartDate] =
    useState("");

  const [publishEndDate, setPublishEndDate] =
    useState("");

  const [publishStartTime, setPublishStartTime] =
    useState("");

  const [publishEndTime, setPublishEndTime] =
    useState("");

  const [publishAudience, setPublishAudience] =
    useState("");

  const [showCalendarEditModal, setShowCalendarEditModal] =
    useState(false);

  const [calendarAcademicYear, setCalendarAcademicYear] =
    useState("");

  const [calendarProgramme, setCalendarProgramme] =
    useState("");

  const [calendarBranch, setCalendarBranch] =
    useState("");

  const [calendarYear, setCalendarYear] =
    useState("");

  const [calendarSemester, setCalendarSemester] =
    useState("");

  const [calendarScheme, setCalendarScheme] =
    useState("");

  const [calendarStartDate, setCalendarStartDate] =
    useState("");

  const [calendarEndDate, setCalendarEndDate] =
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

    const isPlatformLevelRole =
      parsedLogin.role ===
        "SUPER_ADMIN" ||
      parsedLogin.role ===
        "PLATFORM_ADMIN";

    /* =====================================
       SUPER ADMIN / PLATFORM ADMIN

       Keep the existing behaviour:
       use the shared ALL tenant calendar
       and auto create it when required.
    ====================================== */

    if (isPlatformLevelRole) {
      let foundCalendar =
        calendarService.getCalendarForTenant(
          "ALL"
        );

      if (!foundCalendar) {
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

      setEvents(
        calendarService.getVisibleEvents(
          foundCalendar.id,
          parsedLogin.role,
          parsedLogin.tenantType
        )
      );

      setLoading(false);
      return;
    }

    /* =====================================
       ALL OTHER ROLES / TENANTS

       Open Calendar directly.
       If the role + tenant does not yet have
       a calendar, create its base calendar
       automatically and stay on this page.
    ====================================== */

    let foundCalendar =
      calendarService.getCalendarForUser(
        parsedLogin.role,
        parsedLogin.tenantType
      );

    if (!foundCalendar) {
      const tenantCalendarTitle =
        parsedLogin.tenantType === "UNIVERSITY"
          ? "University & College Calendar"
          : parsedLogin.tenantType === "SKILL_ACADEMY"
            ? "Skill Academy Calendar"
            : parsedLogin.tenantType === "BOOTCAMP"
              ? "Bootcamp Calendar"
              : parsedLogin.tenantType === "CORPORATE"
                ? "Corporate Calendar"
                : "Calendar Management";

      foundCalendar =
        calendarService.createCalendar({
          tenantId:
            parsedLogin.tenantType,
          ownerId:
            parsedLogin.role,
          title:
            tenantCalendarTitle,
        });
    }

    setCalendar(foundCalendar);

    setEvents(
      calendarService.getVisibleEvents(
          foundCalendar.id,
          parsedLogin.role,
          parsedLogin.tenantType
        )
    );

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

  function getTenantLearnerLabel() {
    switch (loginData?.tenantType) {
      case "CORPORATE":
        return "Employee";
      case "BOOTCAMP":
        return "Bootcamp Learner";
      case "SKILL_ACADEMY":
        return "Skill Academy Learner";
      case "UNIVERSITY":
      default:
        return "Student";
    }
  }

  function getTenantLearnerDescription() {
    switch (loginData?.tenantType) {
      case "CORPORATE":
        return "View your assigned training programs, courses, sessions, assessments, certifications and scheduled employee learning activities.";
      case "BOOTCAMP":
        return "View your bootcamp sessions, coding labs, challenges, projects, mentor sessions, assessments and cohort activities.";
      case "SKILL_ACADEMY":
        return "View your enrolled courses, training sessions, labs, assessments, projects, mentor sessions and academy activities.";
      case "UNIVERSITY":
      default:
        return "View your classes, labs, assessments, assignments, examinations, holidays and scheduled learning activities.";
    }
  }

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
     ROLE / TENANT DATA POINTS
  ======================================== */

  function getCalendarDataLabels() {
    if (isSuperAdmin) {
      return {
        first: "Platform Scope",
        second: "Tenant Coverage",
        third: "Governance Level",
        fourth: "Calendar Access",
        fifth: "Scheduled Events",
        startDate: "Platform Calendar Start",
        endDate: "Platform Calendar End",
      };
    }

    if (isPlatformAdmin) {
      return {
        first: "Platform Scope",
        second: "Tenant Coverage",
        third: "Administration Level",
        fourth: "Calendar Access",
        fifth: "Scheduled Events",
        startDate: "Platform Calendar Start",
        endDate: "Platform Calendar End",
      };
    }

    switch (loginData?.tenantType) {
      case "UNIVERSITY":
        return {
          first: "Academic Year",
          second: "Programme",
          third: "Branch / Specialization",
          fourth: "Year",
          fifth: "Semester",
          startDate: "Semester Start Date",
          endDate: "Semester End Date",
        };

      case "SKILL_ACADEMY":
        return {
          first: "Training Cycle",
          second: "Programme / Course",
          third: "Track / Specialization",
          fourth: "Batch",
          fifth: "Learning Stage",
          startDate: "Training Start Date",
          endDate: "Training End Date",
        };

      case "BOOTCAMP":
        return {
          first: "Cohort Cycle",
          second: "Bootcamp Programme",
          third: "Track",
          fourth: "Cohort / Batch",
          fifth: "Sprint / Phase",
          startDate: "Bootcamp Start Date",
          endDate: "Bootcamp End Date",
        };

      case "CORPORATE":
        return {
          first: "Training Cycle",
          second: "Learning Programme",
          third: "Department / Function",
          fourth: "Employee Group / Batch",
          fifth: "Training Phase",
          startDate: "Programme Start Date",
          endDate: "Programme End Date",
        };

      default:
        return {
          first: "Calendar Cycle",
          second: "Programme",
          third: "Track",
          fourth: "Batch",
          fifth: "Phase",
          startDate: "Start Date",
          endDate: "End Date",
        };
    }
  }

  function getCalendarDataPoints() {
    if (isSuperAdmin) {
      return [
        ["Platform Scope", "All Tenants"],
        ["Tenant Coverage", "4 Tenant Types"],
        ["Governance Level", "Super Admin"],
        ["Calendar Access", "Platform-wide"],
        ["Scheduled Events", String(events.length)],
      ];
    }

    if (isPlatformAdmin) {
      return [
        ["Platform Scope", "All Tenants"],
        ["Tenant Coverage", "4 Tenant Types"],
        ["Administration Level", "Platform Admin"],
        ["Calendar Access", "Cross-tenant"],
        ["Scheduled Events", String(events.length)],
      ];
    }

    const labels = getCalendarDataLabels();

    return [
      [labels.first, calendar?.academicYear || "-"],
      [labels.second, calendar?.programme || "-"],
      [labels.third, calendar?.branch || "-"],
      [labels.fourth, calendar?.year || "-"],
      [labels.fifth, calendar?.semester || "-"],
    ];
  }

  /* ========================================
     DESCRIPTION
  ======================================== */

  function getCalendarDescription() {
    if (!loginData) {
      return "";
    }

    if (isStudent) {
      return getTenantLearnerDescription();
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

    if (!loginData) {
      return;
    }

    setEvents(
      calendarService.getVisibleEvents(
        targetCalendar.id,
        loginData.role,
        loginData.tenantType
      )
    );
  }

  /* ========================================
     EDIT CALENDAR
  ======================================== */

  function openCalendarEdit() {
    if (
      !calendar ||
      !canManage ||
      isStudent
    ) {
      return;
    }

    setCalendarAcademicYear(
      calendar.academicYear || ""
    );

    setCalendarProgramme(
      calendar.programme || ""
    );

    setCalendarBranch(
      calendar.branch || ""
    );

    setCalendarYear(
      calendar.year || ""
    );

    setCalendarSemester(
      calendar.semester || ""
    );

    setCalendarScheme(
      calendar.scheme || ""
    );

    setCalendarStartDate(
      calendar.startDate || ""
    );

    setCalendarEndDate(
      calendar.endDate || ""
    );

    setShowCalendarEditModal(true);
  }

  function handleCalendarUpdate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !calendar ||
      !canManage ||
      isStudent
    ) {
      return;
    }

    if (
      calendarEndDate &&
      calendarStartDate &&
      calendarEndDate < calendarStartDate
    ) {
      const labels =
        getCalendarDataLabels();

      alert(
        `${labels.endDate} cannot be before ${labels.startDate}.`
      );
      return;
    }

    const updatedCalendar =
      calendarService.updateCalendar(
        calendar.id,
        {
          title:
            isSuperAdmin || isPlatformAdmin
              ? calendar.title
              : `${calendarProgramme} ${calendarBranch} ${calendarSemester}`.trim() ||
                calendar.title,
          academicYear:
            calendarAcademicYear,
          programme:
            calendarProgramme,
          branch:
            calendarBranch,
          year:
            calendarYear,
          semester:
            calendarSemester,
          scheme:
            calendarScheme,
          startDate:
            calendarStartDate,
          endDate:
            calendarEndDate,
        }
      );

    if (updatedCalendar) {
      setCalendar(updatedCalendar);
    }

    setShowCalendarEditModal(false);
  }

  function handleCalendarDelete() {
    if (
      !calendar ||
      !canManage ||
      isStudent
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this calendar? All events in this calendar will also be deleted."
      );

    if (!confirmed) {
      return;
    }

    const deleted =
      calendarService.deleteCalendar(
        calendar.id
      );

    if (!deleted) {
      return;
    }

    setCalendar(null);
    setEvents([]);

    if (
      isSuperAdmin ||
      isPlatformAdmin
    ) {
      window.location.reload();
      return;
    }

    router.replace(
      "/calendar-management/create-calendar"
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

    setEventDataPoints({});
    setShowAttachmentOptions(false);
    setAttachmentType("");
    setAttachmentValue("");
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

    setEventDataPoints(
      event.dataPoints || {}
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
      !eventType
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

          dataPoints: eventDataPoints,

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

        dataPoints: eventDataPoints,

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

  function getPublishAudienceOptions() {
    if (!loginData) return [];

    const learner =
      loginData.tenantType === "CORPORATE"
        ? "Employees"
        : loginData.tenantType === "BOOTCAMP"
          ? "Bootcamp Learners"
          : loginData.tenantType === "SKILL_ACADEMY"
            ? "Skill Academy Learners"
            : "Students";

    const faculty =
      loginData.tenantType === "CORPORATE"
        ? "Trainers"
        : loginData.tenantType === "BOOTCAMP"
          ? "Instructors / Mentors"
          : loginData.tenantType === "SKILL_ACADEMY"
            ? "Trainers"
            : "Faculty";

    const instituteAdmins =
      loginData.tenantType === "CORPORATE"
        ? "Corporate Admins"
        : loginData.tenantType === "BOOTCAMP"
          ? "Bootcamp Admins"
          : loginData.tenantType === "SKILL_ACADEMY"
            ? "Skill Academy Admins"
            : "Institute Admins";

    switch (loginData.role) {
      case "SUPER_ADMIN":
        return [
          "All Allowed Users",
          "Platform Admins",
          instituteAdmins,
          "Coordinators",
          faculty,
          learner,
        ];

      case "PLATFORM_ADMIN":
        return [
          instituteAdmins,
          "Coordinators",
          faculty,
          learner,
        ];

      case "TENANT_ADMIN":
        return [
          "Coordinators",
          faculty,
          learner,
        ];

      case "COORDINATOR":
        return [
          faculty,
          learner,
        ];

      case "FACULTY":
        return [learner];

      default:
        return [];
    }
  }

  function openPublishForm(
    event: CalendarEvent
  ) {
    setPublishEvent(event);
    setPublishStartDate(event.startDate || "");
    setPublishEndDate(event.endDate || "");
    setPublishStartTime(event.startTime || "");
    setPublishEndTime(event.endTime || "");
    const allowedAudiences =
      getPublishAudienceOptions();

    setPublishAudience(
      event.audience &&
      allowedAudiences.includes(event.audience)
        ? event.audience
        : ""
    );
    setOpenActionEventId(null);
    setShowPublishModal(true);
  }

  function handlePublishEvent(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!publishEvent) {
      return;
    }

    calendarService.updateEvent(
      publishEvent.id,
      {
        startDate: publishStartDate,
        endDate: publishEndDate,
        startTime: publishStartTime,
        endTime: publishEndTime,
        audience: publishAudience,
        status: "PUBLISHED",
      } as Partial<CalendarEvent>
    );

    refreshEvents();
    setShowPublishModal(false);
    setPublishEvent(null);
  }

  function getReuseTitle(
    event: CalendarEvent
  ) {
    const baseTitle =
      event.title.replace(/\s+\d+$/, "");

    let highestNumber = 1;

    events.forEach((existingEvent) => {
      const existingBase =
        existingEvent.title.replace(
          /\s+\d+$/,
          ""
        );

      if (existingBase !== baseTitle) {
        return;
      }

      const numberMatch =
        existingEvent.title.match(
          /\s+(\d+)$/
        );

      const number =
        numberMatch
          ? Number(numberMatch[1])
          : 1;

      highestNumber =
        Math.max(
          highestNumber,
          number
        );
    });

    return `${baseTitle} ${highestNumber + 1}`;
  }

  function handleReuseEvent(
    event: CalendarEvent
  ) {
    setEditingEvent(null);

    // Copy the same event details.
    // Only the title changes: Event, Event 2, Event 3...
    setTitle(getReuseTitle(event));
    setEventType(event.eventType);
    setDescription(event.description || "");
    setEventDataPoints(event.dataPoints || {});
    setStartDate(event.startDate || "");
    setEndDate(event.endDate || "");
    setStartTime(event.startTime || "");
    setEndTime(event.endTime || "");
    setAudience(event.audience || "");
    setOpenActionEventId(null);
    setShowModal(true);
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
                isStudent
                  ? getTenantLearnerLabel()
                  : loginData.displayRole
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
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
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
                </div>
              )}
          </div>

          {/* =================================
              ROLE / TENANT CALENDAR DATA
          ================================== */}

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
              ? `${getTenantLearnerLabel()} View Only`
              : "✓ Editing Enabled"}
          </div>

          {/* =================================
              CALENDAR
          ================================== */}

          {calendar ? (
            <CalendarView
              events={
                Array.isArray(events)
                  ? events
                  : []
              }

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

          {/* =================================
              SCHEDULED EVENTS SUMMARY
          ================================== */}

          {calendar && (
            <section
              style={{
                marginTop: "24px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "20px",
                    }}
                  >
                    Scheduled Events
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    View what is scheduled and when it will happen.
                  </p>
                </div>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  {events.length} {events.length === 1 ? "event" : "events"}
                </span>
              </div>

              {events.length === 0 ? (
                <div
                  style={{
                    padding: "18px",
                    borderRadius: "8px",
                    background: "#f9fafb",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  No events scheduled yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {[...events]
                    .sort((a, b) => {
                      const first = `${a.startDate} ${a.startTime || "00:00"}`;
                      const second = `${b.startDate} ${b.startTime || "00:00"}`;
                      return first.localeCompare(second);
                    })
                    .map((scheduledEvent) => (
                      <div
                        key={
                          scheduledEvent.id
                        }
                        onClick={() =>
                          openEvent(
                            scheduledEvent
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();
                            openEvent(
                              scheduledEvent
                            );
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "14px 16px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "9px",
                          cursor: "pointer",
                          display: "grid",
                          gridTemplateColumns: canManage && !isStudent
                            ? "minmax(150px, 1fr) minmax(170px, auto) auto"
                            : "minmax(150px, 1fr) minmax(170px, auto)",
                          gap: "14px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background:
                                  getEventMarkerColor(
                                    events.findIndex(
                                      (event) =>
                                        event.id === scheduledEvent.id
                                    )
                                  ),
                                flexShrink: 0,
                              }}
                            />

                            <strong
                              style={{
                                display: "block",
                                color: "#111827",
                              }}
                            >
                              {scheduledEvent.title}
                            </strong>
                          </div>

                          <span
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                            }}
                          >
                            {scheduledEvent.eventType}
                            {scheduledEvent.audience
                              ? ` • ${scheduledEvent.audience}`
                              : ""}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            color: "#374151",
                            textAlign: "right",
                          }}
                        >
                          <div>
                            {scheduledEvent.startDate}
                            {scheduledEvent.endDate !== scheduledEvent.startDate
                              ? ` → ${scheduledEvent.endDate}`
                              : ""}
                          </div>

                          {(scheduledEvent.startTime || scheduledEvent.endTime) && (
                            <div
                              style={{
                                marginTop: "3px",
                                color: "#6b7280",
                              }}
                            >
                              {scheduledEvent.startTime || "--:--"}
                              {scheduledEvent.endTime
                                ? ` - ${scheduledEvent.endTime}`
                                : ""}
                            </div>
                          )}
                        </div>

                        {canManage && !isStudent && (
                          <div
                            style={{
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenActionEventId(
                                  (current) =>
                                    current === scheduledEvent.id
                                      ? null
                                      : scheduledEvent.id
                                );
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 12px",
                                background: "#ffffff",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "7px",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "18px",
                                  lineHeight: 1,
                                }}
                              >
                                +
                              </span>
                              Action
                            </button>

                            {openActionEventId === scheduledEvent.id && (
                              <div
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "calc(100% + 6px)",
                                  zIndex: 20,
                                  minWidth: "150px",
                                  padding: "6px",
                                  background: "#ffffff",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                }}
                              >
                                {[
                                  ["Edit", () => {
                                    setOpenActionEventId(null);
                                    openEvent(scheduledEvent);
                                  }],
                                  ["Reuse", () =>
                                    handleReuseEvent(scheduledEvent)
                                  ],
                                  ["Publish", () =>
                                    openPublishForm(scheduledEvent)
                                  ],
                                  ["Delete", () => {
                                    const confirmed =
                                      window.confirm(
                                        "Are you sure you want to delete this event?"
                                      );

                                    if (!confirmed) return;

                                    calendarService.deleteEvent(
                                      scheduledEvent.id
                                    );
                                    setOpenActionEventId(null);
                                    refreshEvents();
                                  }],
                                ].map(([label, action]) => (
                                  <button
                                    key={label as string}
                                    type="button"
                                    onClick={action as () => void}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      padding: "9px 10px",
                                      border: "none",
                                      borderRadius: "6px",
                                      background: "transparent",
                                      textAlign: "left",
                                      cursor: "pointer",
                                      color:
                                        label === "Delete"
                                          ? "#b91c1c"
                                          : "#374151",
                                    }}
                                  >
                                    {label as string}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* =====================================
          EDIT CALENDAR MODAL
      ====================================== */}

      {showCalendarEditModal && calendar && (
        <div
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowCalendarEditModal(false);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1001,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <form
            onSubmit={
              handleCalendarUpdate
            }
            style={{
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "14px",
              padding: "26px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                }}
              >
                Edit Calendar
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCalendarEditModal(false)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {isSuperAdmin || isPlatformAdmin ? (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "18px",
                  display: "grid",
                  gap: "10px",
                }}
              >
                {getCalendarDataPoints().map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      fontSize: "14px",
                    }}
                  >
                    <strong>{label}</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <FormField label={getCalendarDataLabels().first}>
                  <input
                    type="text"
                    value={calendarAcademicYear}
                    onChange={(event) =>
                      setCalendarAcademicYear(event.target.value)
                    }
                    style={inputStyle}
                  />
                </FormField>

                <FormField label={getCalendarDataLabels().second}>
                  <input
                    type="text"
                    value={calendarProgramme}
                    onChange={(event) =>
                      setCalendarProgramme(event.target.value)
                    }
                    style={inputStyle}
                  />
                </FormField>

                <FormField label={getCalendarDataLabels().third}>
                  <input
                    type="text"
                    value={calendarBranch}
                    onChange={(event) =>
                      setCalendarBranch(event.target.value)
                    }
                    style={inputStyle}
                  />
                </FormField>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}
                >
                  <FormField label={getCalendarDataLabels().fourth}>
                    <input
                      type="text"
                      value={calendarYear}
                      onChange={(event) =>
                        setCalendarYear(event.target.value)
                      }
                      style={inputStyle}
                    />
                  </FormField>

                  <FormField label={getCalendarDataLabels().fifth}>
                    <input
                      type="text"
                      value={calendarSemester}
                      onChange={(event) =>
                        setCalendarSemester(event.target.value)
                      }
                      style={inputStyle}
                    />
                  </FormField>
                </div>

                <FormField label="Scheme / Framework">
                  <input
                    type="text"
                    value={calendarScheme}
                    onChange={(event) =>
                      setCalendarScheme(event.target.value)
                    }
                    style={inputStyle}
                  />
                </FormField>
              </>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <FormField label={getCalendarDataLabels().startDate}>
                <input
                  type="date"
                  value={calendarStartDate}
                  onChange={(event) =>
                    setCalendarStartDate(event.target.value)
                  }
                  style={inputStyle}
                />
              </FormField>

              <FormField label={getCalendarDataLabels().endDate}>
                <input
                  type="date"
                  min={
                    calendarStartDate ||
                    undefined
                  }
                  value={calendarEndDate}
                  onChange={(event) =>
                    setCalendarEndDate(event.target.value)
                  }
                  style={inputStyle}
                />
              </FormField>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setShowCalendarEditModal(false)
                }
                style={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={primaryButton}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {showPublishModal && publishEvent && (
        <div
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowPublishModal(false);
              setPublishEvent(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <form
            onSubmit={handlePublishEvent}
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#ffffff",
              borderRadius: "14px",
              padding: "26px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "22px",
              }}
            >
              <h2 style={{ margin: 0 }}>
                Publish Event
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowPublishModal(false);
                  setPublishEvent(null);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <FormField label="Start Date">
                <input
                  type="date"
                  required
                  value={publishStartDate}
                  onChange={(event) =>
                    setPublishStartDate(event.target.value)
                  }
                  style={inputStyle}
                />
              </FormField>

              <FormField label="End Date">
                <input
                  type="date"
                  required
                  min={publishStartDate || undefined}
                  value={publishEndDate}
                  onChange={(event) =>
                    setPublishEndDate(event.target.value)
                  }
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Start Time (24-hour)">
                <select
                  required
                  value={publishStartTime}
                  onChange={(event) =>
                    setPublishStartTime(event.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">Select time</option>
                  <option value="00:00">00:00</option>
                  <option value="00:30">00:30</option>
                  <option value="01:00">01:00</option>
                  <option value="01:30">01:30</option>
                  <option value="02:00">02:00</option>
                  <option value="02:30">02:30</option>
                  <option value="03:00">03:00</option>
                  <option value="03:30">03:30</option>
                  <option value="04:00">04:00</option>
                  <option value="04:30">04:30</option>
                  <option value="05:00">05:00</option>
                  <option value="05:30">05:30</option>
                  <option value="06:00">06:00</option>
                  <option value="06:30">06:30</option>
                  <option value="07:00">07:00</option>
                  <option value="07:30">07:30</option>
                  <option value="08:00">08:00</option>
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                  <option value="22:00">22:00</option>
                  <option value="22:30">22:30</option>
                  <option value="23:00">23:00</option>
                  <option value="23:30">23:30</option>
                </select>
              </FormField>

              <FormField label="End Time (24-hour)">
                <select
                  required
                  value={publishEndTime}
                  onChange={(event) =>
                    setPublishEndTime(event.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">Select time</option>
                  <option value="00:00">00:00</option>
                  <option value="00:30">00:30</option>
                  <option value="01:00">01:00</option>
                  <option value="01:30">01:30</option>
                  <option value="02:00">02:00</option>
                  <option value="02:30">02:30</option>
                  <option value="03:00">03:00</option>
                  <option value="03:30">03:30</option>
                  <option value="04:00">04:00</option>
                  <option value="04:30">04:30</option>
                  <option value="05:00">05:00</option>
                  <option value="05:30">05:30</option>
                  <option value="06:00">06:00</option>
                  <option value="06:30">06:30</option>
                  <option value="07:00">07:00</option>
                  <option value="07:30">07:30</option>
                  <option value="08:00">08:00</option>
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                  <option value="22:00">22:00</option>
                  <option value="22:30">22:30</option>
                  <option value="23:00">23:00</option>
                  <option value="23:30">23:30</option>
                </select>
              </FormField>
            </div>

            <FormField label="Audience">
              <select
                required
                value={publishAudience}
                onChange={(event) =>
                  setPublishAudience(event.target.value)
                }
                style={inputStyle}
              >
                <option value="">
                  Select audience
                </option>

                {getPublishAudienceOptions().map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>
            </FormField>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowPublishModal(false);
                  setPublishEvent(null);
                }}
                style={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={primaryButton}
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================
          EVENT MODAL
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

                  {getEventTypesForContext(loginData).map(
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
                ROLE / TENANT DATA POINTS
            ================================== */}

            {getDataPointsForContext(loginData).map((dataPoint) => {
              const dropdownOptions =
                getDropdownOptionsForDataPoint(dataPoint);

              return (
                <FormField
                  key={dataPoint.key}
                  label={dataPoint.label}
                >
                  {dropdownOptions && !isStudent ? (
                    <select
                      value={eventDataPoints[dataPoint.key] || ""}
                      onChange={(event) =>
                        setEventDataPoints((current) => ({
                          ...current,
                          [dataPoint.key]: event.target.value,
                        }))
                      }
                      style={inputStyle}
                    >
                      <option value="">
                        Select {dataPoint.label}
                      </option>

                      {dropdownOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={eventDataPoints[dataPoint.key] || ""}
                      readOnly={isStudent}
                      placeholder={dataPoint.placeholder || ""}
                      onChange={(event) =>
                        setEventDataPoints((current) => ({
                          ...current,
                          [dataPoint.key]: event.target.value,
                        }))
                      }
                      style={{
                        ...inputStyle,
                        background: isStudent ? "#f9fafb" : "#ffffff",
                      }}
                    />
                  )}
                </FormField>
              );
            })}

            {/* =================================
                ATTACHMENTS
            ================================== */}

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <label>
                  Attachments
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowAttachmentOptions(
                      (current) => !current
                    )
                  }
                  disabled={isStudent}
                  style={{
                    width: "26px",
                    height: "26px",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: "18px",
                    fontWeight: 400,
                    lineHeight: 1,
                    cursor: isStudent ? "default" : "pointer",
                    flexShrink: 0,
                  }}
                  aria-label="Add attachment"
                >
                  +
                </button>
              </div>

              {showAttachmentOptions && !isStudent && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    ["link", "Attach Link"],
                    ["document", "Document / Device"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setAttachmentType(value)
                      }
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "7px",
                        background:
                          attachmentType === value
                            ? "#eef2ff"
                            : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {attachmentType === "link" && (
                <input
                  type="url"
                  value={attachmentValue}
                  placeholder="Paste attachment link"
                  onChange={(event) =>
                    setAttachmentValue(event.target.value)
                  }
                  style={{
                    ...inputStyle,
                    marginTop: "10px",
                  }}
                />
              )}

              {attachmentType === "document" && (
                <input
                  type="file"
                  onChange={(event) =>
                    setAttachmentValue(
                      event.target.files?.[0]?.name || ""
                    )
                  }
                  style={{
                    ...inputStyle,
                    marginTop: "10px",
                  }}
                />
              )}
            </div>

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

                maxLength={250}

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
                    "none",

                  background:
                    isStudent
                      ? "#f9fafb"
                      : "#ffffff",
                }}
              />

              <div
                style={{
                  marginTop: "5px",
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                {description.length}/250
              </div>
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

const secondaryButton = {
  padding:
    "10px 18px",

  background:
    "#ffffff",

  color:
    "#374151",

  border:
    "1px solid #d1d5db",

  borderRadius:
    "7px",

  cursor:
    "pointer",

  fontWeight:
    600,
};

const deleteButton = {
  padding:
    "10px 18px",

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

  fontWeight:
    600,
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