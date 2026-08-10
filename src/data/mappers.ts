import { FileText, PlayCircle, Github, BookOpen } from "lucide-react";
import type { SessionStatus, LibraryItem } from "./event";

export const statusBadges = {
  confirmado: { tone: "green" as const, label: "Confirmado" },
  "em-breve": { tone: "yellow" as const, label: "Em breve" },
  concluido: { tone: "gray" as const, label: "Concluído" },
} as const;

export const libraryIcons = {
  slides: FileText,
  replay: PlayCircle,
  repo: Github,
  extra: BookOpen,
} as const;

export function getStatusBadge(status: SessionStatus) {
  return statusBadges[status];
}

export function getLibraryIcon(iconType: LibraryItem["icon"]) {
  return libraryIcons[iconType];
}
