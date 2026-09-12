export type UserRole =
  | "SUPER_ADMIN"
  | "PLATFORM_ADMIN"
  | "INSTITUTE_ADMIN"
  | "COORDINATOR"
  | "FACULTY"
  | "STUDENT";

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tenantName?: string;
}