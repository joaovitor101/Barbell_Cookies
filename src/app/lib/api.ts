const STORAGE_KEY = "barbell_admin_token";

export function getApiBase(): string {
  const base = import.meta.env.VITE_API_URL;
  return typeof base === "string" ? base.replace(/\/$/, "") : "";
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${p}`;
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminToken(token: string | null): void {
  if (token) sessionStorage.setItem(STORAGE_KEY, token);
  else sessionStorage.removeItem(STORAGE_KEY);
}

export function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}
