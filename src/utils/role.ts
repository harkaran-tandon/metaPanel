export type Role = "admin" | "editor";

export function isAdmin(role?: string): boolean {
  return role === "admin";
}

export function isEditor(role?: string): boolean {
  return role === "editor";
}
