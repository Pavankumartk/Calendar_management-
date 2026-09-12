"use client";

import React, {
  useEffect,
  useState,
} from "react";

// ========================================
// ORIGINAL MEMBER 2 IMPORT
// Enable after Member 2 integration
// ========================================

// import { usePermissions } from "@/features/calendar/hooks/usePermissions";

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
}

export default function PermissionGuard({
  permission,
  children,
}: PermissionGuardProps) {
  // ========================================
  // ORIGINAL MEMBER 2 LOGIC
  // ========================================

  /*
  const {
    hasPermission,
  } = usePermissions();

  if (
    !hasPermission(permission)
  ) {
    return null;
  }

  return <>{children}</>;
  */

  // ========================================
  // TEMPORARY DUMMY LOGIN PERMISSIONS
  // ========================================

  const [
    currentRole,
    setCurrentRole,
  ] = useState("");

  const [
    loaded,
    setLoaded,
  ] = useState(false);

  useEffect(() => {
    const savedLogin =
      localStorage.getItem(
        "calendar_dummy_login"
      );

    if (savedLogin) {
      try {
        const loginData =
          JSON.parse(savedLogin);

        setCurrentRole(
          loginData.role || ""
        );
      } catch (error) {
        console.error(
          "Invalid login data:",
          error
        );
      }
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  const hasPermission = (
    permissionKey: string
  ) => {
    /*
      FULL ACCESS
    */

    if (
      currentRole ===
        "SUPER_ADMIN" ||
      currentRole ===
        "PLATFORM_ADMIN" ||
      currentRole ===
        "TENANT_ADMIN"
    ) {
      return true;
    }

    /*
      COORDINATOR / MANAGER

      Temporary delegated permissions.
    */

    if (
      currentRole ===
      "COORDINATOR"
    ) {
      return [
        "calendar.view",
        "event.view",
        "event.create",
        "event.edit",
        "event.publish",
        "audience.select",
      ].includes(
        permissionKey
      );
    }

    /*
      FACULTY / TRAINER /
      INSTRUCTOR
    */

    if (
      currentRole ===
      "FACULTY"
    ) {
      return [
        "calendar.view",
        "event.view",
        "event.create",
        "event.edit",
      ].includes(
        permissionKey
      );
    }

    /*
      STUDENT / LEARNER /
      EMPLOYEE

      View only.
    */

    if (
      currentRole ===
      "LEARNER"
    ) {
      return [
        "calendar.view",
        "event.view",
      ].includes(
        permissionKey
      );
    }

    return false;
  };

  if (
    !hasPermission(
      permission
    )
  ) {
    return null;
  }

  return <>{children}</>;
}