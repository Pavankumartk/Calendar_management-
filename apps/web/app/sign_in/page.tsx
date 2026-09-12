"use client";

import Image from "next/image";
import { useState } from "react";
import "./signin.css";

/* ========================================
   ROLE OPTIONS
======================================== */

const ROLE_OPTIONS = [
  {
    label: "Super Admin",
    value: "SUPER_ADMIN",
  },
  {
    label: "Platform Admin",
    value: "PLATFORM_ADMIN",
  },
  {
    label: "Institute Admin",
    value: "TENANT_ADMIN",
  },
  {
    label: "Coordinator",
    value: "COORDINATOR",
  },
  {
    label: "Faculty",
    value: "FACULTY",
  },
  {
    label: "Student",
    value: "LEARNER",
  },
];

/* ========================================
   CURRENTLY CONNECTED TENANTS
======================================== */

const TENANT_OPTIONS = [
  {
    label: "University & College",
    value: "UNIVERSITY",
  },
  {
    label: "Skill Academy",
    value: "SKILL_ACADEMY",
  },
  {
    label: "Bootcamp",
    value: "BOOTCAMP",
  },
  {
    label: "Corporate",
    value: "CORPORATE",
  },
];

export default function LoginPage() {
  const [role, setRole] =
    useState("");

  const [tenantType, setTenantType] =
    useState("");

  /* ========================================
     SUPER ADMIN / PLATFORM ADMIN
     DO NOT REQUIRE A TENANT
  ======================================== */

  const isPlatformLevelRole =
    role === "SUPER_ADMIN" ||
    role === "PLATFORM_ADMIN";

  /* ========================================
     ROLE CHANGE
  ======================================== */

  const handleRoleChange = (
    value: string
  ) => {
    setRole(value);

    /*
      Super Admin and Platform Admin
      work across all tenants.
    */

    if (
      value === "SUPER_ADMIN" ||
      value === "PLATFORM_ADMIN"
    ) {
      setTenantType("");
    }
  };

  /* ========================================
     LOGIN VALIDATION
  ======================================== */

  const loginDisabled =
    !role ||
    (!isPlatformLevelRole &&
      !tenantType);

  /* ========================================
     LOGIN
  ======================================== */

  const handleLogin = () => {
    if (!role) {
      alert(
        "Please select a role."
      );

      return;
    }

    if (
      !isPlatformLevelRole &&
      !tenantType
    ) {
      alert(
        "Please select a tenant."
      );

      return;
    }

    const selectedRole =
      ROLE_OPTIONS.find(
        (item) =>
          item.value === role
      );

    const selectedTenant =
      TENANT_OPTIONS.find(
        (item) =>
          item.value === tenantType
      );

    const loginData = {
      loggedIn: true,

      role,

      displayRole:
        selectedRole?.label ||
        role,

      tenantType:
        isPlatformLevelRole
          ? "ALL"
          : tenantType,

      displayTenant:
        isPlatformLevelRole
          ? "All Tenants"
          : selectedTenant?.label ||
            tenantType,

      loginTime:
        new Date().toISOString(),
    };

    console.log(
      "LOGIN SUCCESS:",
      loginData
    );

    /* ========================================
       SAVE DUMMY LOGIN
    ======================================== */

    localStorage.setItem(
      "calendar_dummy_login",
      JSON.stringify(loginData)
    );

    localStorage.setItem(
      "calendar_current_role",
      role
    );

    localStorage.setItem(
      "calendar_current_tenant",
      loginData.tenantType
    );

    /* ========================================
       NAVIGATE TO DASHBOARD FIRST

       Correct flow:

       Sign In
          ↓
       Dashboard
          ↓
       Sidebar
          ↓
       Calendar Management
          ↓
       Calendar
    ======================================== */

    window.location.href =
      "/dashboard";
  };

  return (
    <main className="loginPage">
      <section
        className="loginCard"
        aria-labelledby="login-title"
      >
        {/* LOGO */}

        <div className="loginLogoWrap">
          <Image
            src="/images/logo.png"
            alt="NeuroLXP"
            width={146}
            height={146}
            className="loginLogo"
            priority
          />
        </div>

        {/* TITLE */}

        <h1
          id="login-title"
          className="loginTitle"
        >
          NeuroLXP
        </h1>

        <p className="loginSubtitle">
          Select your role and tenant
        </p>

        <div className="loginForm">
          {/* =============================
              ROLE
          ============================= */}

          <div className="loginField">
            <label htmlFor="role">
              Role
            </label>

            <div className="loginSelectWrap">
              <select
                id="role"
                value={role}
                onChange={(event) =>
                  handleRoleChange(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select Role
                </option>

                {ROLE_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  )
                )}
              </select>

              <span
                className="loginSelectArrow"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* =============================
              TENANT

              Hidden only for:
              - Super Admin
              - Platform Admin
          ============================= */}

          {role &&
            !isPlatformLevelRole && (
              <div className="loginField">
                <label htmlFor="tenant">
                  Tenant
                </label>

                <div className="loginSelectWrap">
                  <select
                    id="tenant"
                    value={
                      tenantType
                    }
                    onChange={(
                      event
                    ) =>
                      setTenantType(
                        event
                          .target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Select Tenant
                    </option>

                    {TENANT_OPTIONS.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <span
                    className="loginSelectArrow"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

          {/* =============================
              PLATFORM ROLE INFORMATION
          ============================= */}

          {isPlatformLevelRole && (
            <p
              style={{
                margin: 0,

                fontSize:
                  "13px",

                color:
                  "#6b7280",
              }}
            >
              This role has access
              to all tenants.
            </p>
          )}

          {/* LOGIN */}

          <button
            type="button"
            className="loginButton"
            disabled={
              loginDisabled
            }
            onClick={
              handleLogin
            }
          >
            Login
          </button>
        </div>
      </section>
    </main>
  );
}