
"use client";

import Image from "next/image";
import { useState } from "react";
import "./signin.css";

const TENANT_OPTIONS = [
  "Super Admin",
  "Platform Admin",
  "Institute Admin",
  "Coordinator",
  "Faculty",
  "Student",
];

const ACTOR_OPTIONS = [
  "University & College",
  "Skill Academy",
  "Bootcamp",
  "Corporate",
  "Government",
  "NGO",
];

export default function LoginPage() {
  const [tenant, setTenant] = useState("");
  const [actor, setActor] = useState("");

  const tenantOnly =
    tenant === "Super Admin" ||
    tenant === "Platform Admin" ||
    tenant === "Institute Admin";

  const handleTenantChange = (value: string) => {
    setTenant(value);

    if (
      value === "Super Admin" ||
      value === "Platform Admin" ||
      value === "Institute Admin"
    ) {
      setActor("");
    }
  };

  const handleLogin = () => {
    if (!tenant) return;
    if (!tenantOnly && !actor) return;

    console.log("Selected Login Data:", {
      tenant,
      actor: tenantOnly ? "" : actor,
    });
  };

  const loginDisabled =
    !tenant || (!tenantOnly && !actor);

  return (
    <main className="loginPage">
      <section className="loginCard" aria-labelledby="login-title">
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

        <h1 id="login-title" className="loginTitle">
          NeuroLXP
        </h1>

        <p className="loginSubtitle">
          {tenantOnly
            ? "Select your tenant"
            : "Select your tenant and actor"}
        </p>

        <div className="loginForm">
          <div className="loginField">
            <label htmlFor="tenant">Tenant</label>

            <div className="loginSelectWrap">
              <select
                id="tenant"
                value={tenant}
                onChange={(event) =>
                  handleTenantChange(event.target.value)
                }
              >
                <option value="">Select Tenant</option>

                {TENANT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <span
                className="loginSelectArrow"
                aria-hidden="true"
              />
            </div>
          </div>

          {!tenantOnly && (
            <div className="loginField">
              <label htmlFor="actor">Actor</label>

              <div className="loginSelectWrap">
                <select
                  id="actor"
                  value={actor}
                  onChange={(event) =>
                    setActor(event.target.value)
                  }
                >
                  <option value="">Select Actor</option>

                  {ACTOR_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <span
                  className="loginSelectArrow"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            className="loginButton"
            disabled={loginDisabled}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </section>
    </main>
  );
}

