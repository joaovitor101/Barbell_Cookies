const STORAGE_KEY = "barbell_admin_token";

export function getApiBase(): string {
  const base = import.meta.env.VITE_API_URL;
  if (typeof base !== "string") return "";
  const t = base.trim();
  if (t === "" || t.startsWith("http://localhost")) {
    /* em produção, evite VITE_API_URL=localhost no painel da Vercel */
    return "";
  }
  return t.replace(/\/$/, "");
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
