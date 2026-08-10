import type { SessionStatus } from "./event";

/** Antecedência com que o acesso à sessão é liberado. */
const LIVE_WINDOW_MINUTES = 15;

export function getSessionStatus(
  dateTimeISO: string,
  durationMinutes: number,
  now = new Date(),
): SessionStatus {
  const start = new Date(dateTimeISO);
  const opensAt = new Date(start.getTime() - LIVE_WINDOW_MINUTES * 60 * 1000);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  if (now < opensAt) return "em-breve";
  if (now < end) return "confirmado";
  return "concluido";
}

export function formatSessionDate(dateTimeISO: string, locale = "pt-BR"): string {
  const date = new Date(dateTimeISO);
  const dayName = date.toLocaleDateString(locale, { weekday: "long" });
  const dayMonth = date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return `${dayMonth} · ${capitalizedDay}`;
}

export function formatSessionTime(
  dateTimeISO: string,
  durationMinutes: number,
  locale = "pt-BR",
): string {
  const start = new Date(dateTimeISO);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const startTime = start.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = end.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${startTime.replace(":", "h")} às ${endTime.replace(":", "h")}`;
}
