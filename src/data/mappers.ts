import type { SessionStatus } from "./event";

/** Status derivado → aparência e rótulo do badge. */
export const statusBadges = {
  confirmado: { tone: "green" as const, label: "Confirmado" },
  "em-breve": { tone: "yellow" as const, label: "Em breve" },
  concluido: { tone: "gray" as const, label: "Concluído" },
} as const;

export function getStatusBadge(status: SessionStatus) {
  return statusBadges[status];
}
