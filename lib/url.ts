export function getApplicationUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL;
  if (!value) throw new Error("NEXT_PUBLIC_APP_URL must be configured.");
  const url = new URL(value);
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS outside localhost.");
  return url.origin;
}
