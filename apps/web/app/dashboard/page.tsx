"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CalendarSidebar from "@/components/calendar/CalendarSidebar";

import { storageService } from "@/features/calendar/services/storage.service";

import type { DummyUser } from "@/features/calendar/types/role.types";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<DummyUser | null>(null);

  useEffect(() => {
    const currentUser =
      storageService.getCurrentUser();

    if (!currentUser) {
      router.replace("/sign_in");
      return;
    }

    setUser(currentUser);
  }, [router]);

  if (!user) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <CalendarSidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <header
          style={{
            height: "70px",
            padding: "0 30px",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              margin: 0,
            }}
          >
            Dashboard
          </h3>

          <div>
            <strong>{user.name}</strong>
            {" | "}
            {formatRole(user.role)}
          </div>
        </header>

        <main
          style={{
            padding: "30px",
          }}
        >
          <h1
            style={{
              marginBottom: "5px",
            }}
          >
            Welcome to Neuro LXP
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            {user.tenantName || user.tenantId}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",

              gap: "20px",
              marginTop: "30px",
            }}
          >
            <DashboardCard
              title="Total Users"
              value="1,240"
            />

            <DashboardCard
              title="Courses"
              value="24"
            />

            <DashboardCard
              title="Assessments"
              value="18"
            />

            <DashboardCard
              title="Calendar Events"
              value="12"
            />
          </div>

          <div
            style={{
              marginTop: "30px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h2>
              Calendar Management
            </h2>

            <p>
              Click{" "}
              <strong>
                Calendar Management
              </strong>{" "}
              from the left sidebar to open the calendar.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "22px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#6b7280",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function formatRole(role: string) {
  return role
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}