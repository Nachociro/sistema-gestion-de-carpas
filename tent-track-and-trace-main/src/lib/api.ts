export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function j<T>(url: string, init?: RequestInit) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<T>
}