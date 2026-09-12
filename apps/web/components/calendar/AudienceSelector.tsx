"use client";

interface AudienceSelectorProps {
  tenantType: string;
  value: any;
  onChange: (
    value: any
  ) => void;
}

export default function AudienceSelector({
  tenantType,
  value,
  onChange,
}: AudienceSelectorProps) {
  const audience =
    value || {
      type:
        "ENTIRE_TENANT",
    };

  const updateAudience = (
    key: string,
    newValue: string
  ) => {
    onChange({
      ...audience,
      [key]:
        newValue,
    });
  };

  return (
    <div className="audience-selector">
      <h3>
        Target Audience
      </h3>

      <div className="form-field">
        <label>
          Audience Type
        </label>

        <select
          value={
            audience.type ||
            "ENTIRE_TENANT"
          }
          onChange={(
            event
          ) =>
            updateAudience(
              "type",
              event.target.value
            )
          }
        >
          <option value="ENTIRE_TENANT">
            Entire Tenant
          </option>

          <option value="PROGRAMME">
            Programme
          </option>

          <option value="GROUP">
            Group / Batch /
            Cohort / Team
          </option>

          <option value="ROLE">
            Role
          </option>

          <option value="SELECTED_USERS">
            Selected Users
          </option>
        </select>
      </div>

      {audience.type !==
        "ENTIRE_TENANT" && (
        <>
          <div className="form-field">
            <label>
              Level 1
            </label>

            <input
              value={
                audience.level1 ||
                ""
              }
              placeholder={
                tenantType ===
                "CORPORATE"
                  ? "Business Unit"
                  : "Programme"
              }
              onChange={(
                event
              ) =>
                updateAudience(
                  "level1",
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-field">
            <label>
              Level 2
            </label>

            <input
              value={
                audience.level2 ||
                ""
              }
              placeholder={
                tenantType ===
                "UNIVERSITY"
                  ? "Branch"
                  : tenantType ===
                      "CORPORATE"
                    ? "Department"
                    : "Course / Track"
              }
              onChange={(
                event
              ) =>
                updateAudience(
                  "level2",
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-field">
            <label>
              Level 3
            </label>

            <input
              value={
                audience.level3 ||
                ""
              }
              placeholder={
                tenantType ===
                "UNIVERSITY"
                  ? "Semester"
                  : tenantType ===
                      "CORPORATE"
                    ? "Team"
                    : "Batch / Cohort"
              }
              onChange={(
                event
              ) =>
                updateAudience(
                  "level3",
                  event.target.value
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
}