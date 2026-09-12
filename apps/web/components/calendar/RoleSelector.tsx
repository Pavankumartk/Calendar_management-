"use client";

// ========================================
// ORIGINAL MEMBER 2 IMPORT
// ========================================

// import { roles } from "@/features/calendar/data/roles";

// ========================================
// TEMPORARY MOCK IMPORT
// ========================================

import {
  mockRoles as roles,
} from "@/mock/calendar.mock";

interface RoleSelectorProps {
  value: string;
  onChange: (
    value: string
  ) => void;
}

export default function RoleSelector({
  value,
  onChange,
}: RoleSelectorProps) {
  return (
    <div className="form-field">
      <label>
        User Role
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >
        <option value="">
          Select Role
        </option>

        {roles.map(
          (role) => (
            <option
              key={role.id}
              value={role.id}
            >
              {role.name}
            </option>
          )
        )}
      </select>
    </div>
  );
}