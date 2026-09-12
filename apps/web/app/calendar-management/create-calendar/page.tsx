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

import type { DummyUser } from "@/features/calendar/types/role.types";

export default function CreateCalendarPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<DummyUser | null>(
      null
    );

  const [
    academicYear,
    setAcademicYear,
  ] = useState("");

  const [
    programme,
    setProgramme,
  ] = useState("");

  const [
    branch,
    setBranch,
  ] = useState("");

  const [
    year,
    setYear,
  ] = useState("");

  const [
    semester,
    setSemester,
  ] = useState("");

  const [
    scheme,
    setScheme,
  ] = useState("");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  useEffect(() => {
    const currentUser =
      storageService.getCurrentUser();

    if (!currentUser) {
      router.replace(
        "/sign_in"
      );

      return;
    }

    // Super Admin / Platform Admin
    // should NOT use this page.

    if (
      currentUser.role ===
        "SUPER_ADMIN" ||
      currentUser.role ===
        "PLATFORM_ADMIN" ||
      currentUser.role ===
        "STUDENT"
    ) {
      router.replace(
        "/calendar-management"
      );

      return;
    }

    const existingCalendar =
      calendarService.getCalendarForUser(
        currentUser.id,
        currentUser.tenantId
      );

    if (existingCalendar) {
      router.replace(
        "/calendar-management"
      );

      return;
    }

    setUser(currentUser);
  }, [router]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    calendarService.createCalendar(
      {
        tenantId:
          user.tenantId,

        ownerId:
          user.id,

        title: `${programme} ${branch} ${semester}`,

        academicYear,

        programme,

        branch,

        year,

        semester,

        scheme,

        startDate,

        endDate,
      }
    );

    router.replace(
      "/calendar-management"
    );
  }

  if (!user) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight:
          "100vh",

        display:
          "flex",

        background:
          "#f8fafc",
      }}
    >
      <CalendarSidebar />

      <main
        style={{
          flex: 1,

          padding:
            "30px",
        }}
      >
        <form
          onSubmit={
            handleSubmit
          }
          style={{
            maxWidth:
              "700px",

            background:
              "#ffffff",

            padding:
              "30px",

            borderRadius:
              "12px",

            border:
              "1px solid #e5e7eb",
          }}
        >
          <h1>
            Create Calendar
          </h1>

          <SelectField
            label="Academic Year *"
            value={
              academicYear
            }
            onChange={
              setAcademicYear
            }
            options={[
              "2025-26",
              "2026-27",
              "2027-28",
            ]}
          />

          <SelectField
            label="Programme *"
            value={
              programme
            }
            onChange={
              setProgramme
            }
            options={[
              "B.Tech",
              "B.E",
              "B.Sc",
              "BCA",
              "BBA",
              "M.Tech",
              "MBA",
            ]}
          />

          <SelectField
            label="Branch / Specification *"
            value={branch}
            onChange={
              setBranch
            }
            options={[
              "CSE",
              "IT",
              "ECE",
              "EEE",
              "Mechanical",
              "Civil",
              "AI & ML",
              "Data Science",
            ]}
          />

          <SelectField
            label="Year *"
            value={year}
            onChange={
              setYear
            }
            options={[
              "Year 1",
              "Year 2",
              "Year 3",
              "Year 4",
            ]}
          />

          <SelectField
            label="Semester *"
            value={
              semester
            }
            onChange={
              setSemester
            }
            options={[
              "Semester 1",
              "Semester 2",
              "Semester 3",
              "Semester 4",
              "Semester 5",
              "Semester 6",
              "Semester 7",
              "Semester 8",
            ]}
          />

          <SelectField
            label="Scheme"
            value={
              scheme
            }
            onChange={
              setScheme
            }
            required={
              false
            }
            options={[
              "2021 Scheme",
              "2025 Scheme",
              "2026 Scheme",
            ]}
          />

          <div
            style={{
              marginBottom:
                "18px",
            }}
          >
            <label>
              Semester Start Date *
            </label>

            <input
              type="date"
              required
              value={
                startDate
              }
              onChange={(
                event
              ) =>
                setStartDate(
                  event
                    .target
                    .value
                )
              }
              style={
                fieldStyle
              }
            />
          </div>

          <div
            style={{
              marginBottom:
                "18px",
            }}
          >
            <label>
              Semester End Date *
            </label>

            <input
              type="date"
              required
              value={
                endDate
              }
              onChange={(
                event
              ) =>
                setEndDate(
                  event
                    .target
                    .value
                )
              }
              style={
                fieldStyle
              }
            />
          </div>

          <button
            type="submit"
            style={{
              padding:
                "12px 22px",

              cursor:
                "pointer",
            }}
          >
            Create Calendar
          </button>
        </form>
      </main>
    </div>
  );
}

const fieldStyle = {
  width: "100%",

  padding: "11px",

  marginTop: "7px",

  border:
    "1px solid #d1d5db",

  borderRadius:
    "7px",
};

function SelectField({
  label,
  value,
  onChange,
  options,
  required = true,
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  options: string[];

  required?: boolean;
}) {
  return (
    <div
      style={{
        marginBottom:
          "18px",
      }}
    >
      <label>
        {label}
      </label>

      <select
        value={value}
        required={
          required
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        style={
          fieldStyle
        }
      >
        <option value="">
          Select
        </option>

        {options.map(
          (option) => (
            <option
              key={
                option
              }
              value={
                option
              }
            >
              {option}
            </option>
          )
        )}
      </select>
    </div>
  );
}