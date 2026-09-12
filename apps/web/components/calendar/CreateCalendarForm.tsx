"use client";

import {
  useMemo,
  useState,
} from "react";

import TenantSelector from "./TenantSelector";

// ========================================
// ORIGINAL MEMBER 2 IMPORTS
// ========================================

// import { universityData } from "@/features/calendar/data/university";
// import { skillAcademyData } from "@/features/calendar/data/skill-academy";
// import { bootcampData } from "@/features/calendar/data/bootcamp";
// import { corporateData } from "@/features/calendar/data/corporate";

// ========================================
// TEMPORARY MOCK IMPORTS
// ========================================

import {
  mockUniversityData as universityData,
  mockSkillAcademyData as skillAcademyData,
  mockBootcampData as bootcampData,
  mockCorporateData as corporateData,
} from "@/mock/calendar.mock";

interface CreateCalendarFormProps {
  onSubmit: (
    data: any
  ) => void;
}

export default function CreateCalendarForm({
  onSubmit,
}: CreateCalendarFormProps) {
  const [
    tenantType,
    setTenantType,
  ] = useState(
    "UNIVERSITY"
  );

  const [
    formData,
    setFormData,
  ] = useState<any>({
    name: "",
  });

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

  const tenantData =
    useMemo(() => {
      switch (
        tenantType
      ) {
        case "SKILL_ACADEMY":
          return skillAcademyData;

        case "BOOTCAMP":
          return bootcampData;

        case "CORPORATE":
          return corporateData;

        default:
          return universityData;
      }
    }, [tenantType]);

  const handleTenantChange = (
    value: string
  ) => {
    setTenantType(
      value
    );

    setFormData({
      name: "",
    });
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      tenantType,
    });
  };

  return (
    <form
      className="calendar-form"
      onSubmit={
        handleSubmit
      }
    >
      <TenantSelector
        value={
          tenantType
        }
        onChange={
          handleTenantChange
        }
      />

      <div className="form-field">
        <label>
          Calendar Name *
        </label>

        <input
          type="text"
          value={
            formData.name ||
            ""
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

      {tenantType ===
        "UNIVERSITY" && (
        <>
          <SelectField
            label="Academic Year *"
            value={
              formData.academicYear
            }
            options={
              universityData.academicYears
            }
            onChange={(
              value
            ) =>
              handleChange(
                "academicYear",
                value
              )
            }
          />

          <SelectField
            label="Programme *"
            value={
              formData.programme
            }
            options={
              universityData.programmes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "programme",
                value
              )
            }
          />

          <SelectField
            label="Branch / Specification *"
            value={
              formData.branch
            }
            options={
              universityData.branches
            }
            onChange={(
              value
            ) =>
              handleChange(
                "branch",
                value
              )
            }
          />

          <SelectField
            label="Year *"
            value={
              formData.year
            }
            options={
              universityData.years
            }
            onChange={(
              value
            ) =>
              handleChange(
                "year",
                value
              )
            }
          />

          <SelectField
            label="Semester *"
            value={
              formData.semester
            }
            options={
              universityData.semesters
            }
            onChange={(
              value
            ) =>
              handleChange(
                "semester",
                value
              )
            }
          />

          <SelectField
            label="Scheme"
            value={
              formData.scheme
            }
            options={
              universityData.schemes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "scheme",
                value
              )
            }
          />

          <DateField
            label="Semester Start Date *"
            value={
              formData.semesterStartDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "semesterStartDate",
                value
              )
            }
          />

          <DateField
            label="Semester End Date *"
            value={
              formData.semesterEndDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "semesterEndDate",
                value
              )
            }
          />
        </>
      )}

      {tenantType ===
        "SKILL_ACADEMY" && (
        <>
          <SelectField
            label="Training Year *"
            value={
              formData.trainingYear
            }
            options={
              skillAcademyData.trainingYears
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainingYear",
                value
              )
            }
          />

          <SelectField
            label="Programme *"
            value={
              formData.programme
            }
            options={
              skillAcademyData.programmes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "programme",
                value
              )
            }
          />

          <SelectField
            label="Course *"
            value={
              formData.course
            }
            options={
              skillAcademyData.courses
            }
            onChange={(
              value
            ) =>
              handleChange(
                "course",
                value
              )
            }
          />

          <SelectField
            label="Batch *"
            value={
              formData.batch
            }
            options={
              skillAcademyData.batches
            }
            onChange={(
              value
            ) =>
              handleChange(
                "batch",
                value
              )
            }
          />

          <SelectField
            label="Trainer"
            value={
              formData.trainer
            }
            options={
              skillAcademyData.trainers
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainer",
                value
              )
            }
          />

          <SelectField
            label="Training Mode"
            value={
              formData.trainingMode
            }
            options={
              skillAcademyData.modes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainingMode",
                value
              )
            }
          />

          <DateField
            label="Batch Start Date *"
            value={
              formData.batchStartDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "batchStartDate",
                value
              )
            }
          />

          <DateField
            label="Batch End Date *"
            value={
              formData.batchEndDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "batchEndDate",
                value
              )
            }
          />
        </>
      )}

      {tenantType ===
        "BOOTCAMP" && (
        <>
          <SelectField
            label="Bootcamp Programme *"
            value={
              formData.programme
            }
            options={
              bootcampData.programmes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "programme",
                value
              )
            }
          />

          <SelectField
            label="Cohort *"
            value={
              formData.cohort
            }
            options={
              bootcampData.cohorts
            }
            onChange={(
              value
            ) =>
              handleChange(
                "cohort",
                value
              )
            }
          />

          <SelectField
            label="Learning Track *"
            value={
              formData.learningTrack
            }
            options={
              bootcampData.learningTracks
            }
            onChange={(
              value
            ) =>
              handleChange(
                "learningTrack",
                value
              )
            }
          />

          <SelectField
            label="Lead Instructor"
            value={
              formData.instructor
            }
            options={
              bootcampData.instructors
            }
            onChange={(
              value
            ) =>
              handleChange(
                "instructor",
                value
              )
            }
          />

          <SelectField
            label="Mentor"
            value={
              formData.mentor
            }
            options={
              bootcampData.mentors
            }
            onChange={(
              value
            ) =>
              handleChange(
                "mentor",
                value
              )
            }
          />

          <SelectField
            label="Duration"
            value={
              formData.duration
            }
            options={
              bootcampData.durations
            }
            onChange={(
              value
            ) =>
              handleChange(
                "duration",
                value
              )
            }
          />

          <SelectField
            label="Delivery Mode"
            value={
              formData.deliveryMode
            }
            options={
              bootcampData.modes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "deliveryMode",
                value
              )
            }
          />

          <DateField
            label="Cohort Start Date *"
            value={
              formData.cohortStartDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "cohortStartDate",
                value
              )
            }
          />

          <DateField
            label="Cohort End Date *"
            value={
              formData.cohortEndDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "cohortEndDate",
                value
              )
            }
          />
        </>
      )}

      {tenantType ===
        "CORPORATE" && (
        <>
          <SelectField
            label="Calendar Year *"
            value={
              formData.calendarYear
            }
            options={
              corporateData.calendarYears
            }
            onChange={(
              value
            ) =>
              handleChange(
                "calendarYear",
                value
              )
            }
          />

          <SelectField
            label="Business Unit"
            value={
              formData.businessUnit
            }
            options={
              corporateData.businessUnits
            }
            onChange={(
              value
            ) =>
              handleChange(
                "businessUnit",
                value
              )
            }
          />

          <SelectField
            label="Department *"
            value={
              formData.department
            }
            options={
              corporateData.departments
            }
            onChange={(
              value
            ) =>
              handleChange(
                "department",
                value
              )
            }
          />

          <SelectField
            label="Team"
            value={
              formData.team
            }
            options={
              corporateData.teams
            }
            onChange={(
              value
            ) =>
              handleChange(
                "team",
                value
              )
            }
          />

          <SelectField
            label="Training Programme *"
            value={
              formData.trainingProgramme
            }
            options={
              corporateData.programmes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainingProgramme",
                value
              )
            }
          />

          <SelectField
            label="Training Type *"
            value={
              formData.trainingType
            }
            options={
              corporateData.trainingTypes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainingType",
                value
              )
            }
          />

          <SelectField
            label="Audience *"
            value={
              formData.audience
            }
            options={
              corporateData.audiences
            }
            onChange={(
              value
            ) =>
              handleChange(
                "audience",
                value
              )
            }
          />

          <SelectField
            label="Delivery Mode"
            value={
              formData.deliveryMode
            }
            options={
              corporateData.modes
            }
            onChange={(
              value
            ) =>
              handleChange(
                "deliveryMode",
                value
              )
            }
          />

          <DateField
            label="Training Start Date *"
            value={
              formData.trainingStartDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainingStartDate",
                value
              )
            }
          />

          <DateField
            label="Training End Date / Deadline *"
            value={
              formData.trainingEndDate
            }
            onChange={(
              value
            ) =>
              handleChange(
                "trainingEndDate",
                value
              )
            }
          />
        </>
      )}

      <button
        type="submit"
        className="primary-button"
      >
        Create Calendar
      </button>
    </form>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <select
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >
        <option value="">
          Select
        </option>

        {options.map(
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
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <input
        type="date"
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </div>
  );
}