"use client";

// ========================================
// ORIGINAL MEMBER 2 IMPORT
// ========================================

// import { tenants } from "@/features/calendar/data/tenants";

// ========================================
// TEMPORARY MOCK IMPORT
// ========================================

import {
  mockTenants as tenants,
} from "@/mock/calendar.mock";

interface TenantSelectorProps {
  value: string;
  onChange: (
    value: string
  ) => void;
}

export default function TenantSelector({
  value,
  onChange,
}: TenantSelectorProps) {
  return (
    <div className="form-field">
      <label>
        Tenant Type
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
          Select Tenant
        </option>

        {tenants.map(
          (tenant) => (
            <option
              key={tenant.type}
              value={
                tenant.type
              }
            >
              {tenant.name}
            </option>
          )
        )}
      </select>
    </div>
  );
}