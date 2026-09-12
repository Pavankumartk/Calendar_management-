import type { UserRole } from "../types/role.types";

import type { CalendarPermission } from "../types/permission.types";

const permissions: Record<
  UserRole,
  CalendarPermission
> = {
  SUPER_ADMIN: {
    canViewCalendar: true,
    canCreateCalendar: true,
    canEditCalendar: true,
    canCreateEvent: true,
    canEditEvent: true,
    canDeleteEvent: true,
  },

  PLATFORM_ADMIN: {
    canViewCalendar: true,
    canCreateCalendar: true,
    canEditCalendar: true,
    canCreateEvent: true,
    canEditEvent: true,
    canDeleteEvent: true,
  },

  INSTITUTE_ADMIN: {
    canViewCalendar: true,
    canCreateCalendar: true,
    canEditCalendar: true,
    canCreateEvent: true,
    canEditEvent: true,
    canDeleteEvent: false,
  },

  COORDINATOR: {
    canViewCalendar: true,
    canCreateCalendar: true,
    canEditCalendar: true,
    canCreateEvent: true,
    canEditEvent: true,
    canDeleteEvent: false,
  },

  FACULTY: {
    canViewCalendar: true,
    canCreateCalendar: true,
    canEditCalendar: false,
    canCreateEvent: false,
    canEditEvent: false,
    canDeleteEvent: false,
  },

  STUDENT: {
    canViewCalendar: true,
    canCreateCalendar: false,
    canEditCalendar: false,
    canCreateEvent: false,
    canEditEvent: false,
    canDeleteEvent: false,
  },
};

export const permissionService = {
  getPermissions(
    role: UserRole
  ): CalendarPermission {
    return permissions[role];
  },
};