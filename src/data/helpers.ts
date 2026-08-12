import { gerarLinkGoogleCalendar } from "@/lib/calendar";
import type { Session, SessionStatus, WeekBlock } from "./event";

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

/**
 * Semana que deve vir selecionada ao abrir a página: a primeira que ainda tem
 * alguma sessão por acontecer. Depois do evento, cai na última.
 */
export function getCurrentWeekIndex(weeks: WeekBlock[], now = new Date()): number {
  const index = weeks.findIndex((week) =>
    week.sessions.some((session) => {
      const end = new Date(session.dateTime).getTime() + session.durationMinutes * 60 * 1000;
      return end > now.getTime();
    }),
  );
  return index === -1 ? weeks.length - 1 : index;
}

/**
 * Texto que vai no campo de detalhes do evento no calendário.
 *
 * Repete o link do Zoom aqui de propósito: quando o aluno abrir o compromisso na
 * agenda, no dia da aula, ele precisa do link ali — e não de voltar à página
 * para procurá-lo.
 */
function buildCalendarDescription(session: Session): string {
  const linhas: string[] = [];

  if (session.description) linhas.push(session.description);
  if (session.topic) linhas.push(`Tema: ${session.topic}`);
  if (session.instructor) linhas.push(`Ministrado por: ${session.instructor}`);
  if (session.zoomUrl) linhas.push(`Acesso: ${session.zoomUrl}`);

  return linhas.join("\n\n");
}

/**
 * ADAPTADOR entre a camada de dados e a lógica genérica de calendário.
 *
 * Converte uma `Session` deste evento no `CalendarEvent` agnóstico que
 * src/lib/calendar.ts entende. É aqui — e só aqui — que se sabe que uma sessão
 * guarda duração em minutos em vez de hora de término.
 *
 * Devolve `null` em vez de lançar: uma data mal cadastrada em event.ts
 * desabilita apenas este botão, com erro nomeado no console, em vez de derrubar
 * a página inteira do evento.
 */
export function getSessionCalendarUrl(session: Session): string | null {
  const start = new Date(session.dateTime);

  if (Number.isNaN(start.getTime())) {
    console.error(
      `[calendário] A sessão "${session.id}" tem dateTime inválido ("${session.dateTime}"). ` +
        `O botão "Adicionar ao Calendário" ficará desabilitado. ` +
        `Formato esperado: 2026-09-01T19:00:00-03:00`,
    );
    return null;
  }

  const end = new Date(start.getTime() + session.durationMinutes * 60 * 1000);

  try {
    return gerarLinkGoogleCalendar({
      titulo: session.title,
      inicio: session.dateTime,
      // toISOString() devolve UTC com "Z" — fuso explícito, como a lógica exige.
      fim: end.toISOString(),
      descricao: buildCalendarDescription(session),
      // Sem link definido ainda, o local genérico já informa que é remoto.
      local: session.zoomUrl || "Online — Zoom",
    });
  } catch (erro) {
    console.error(
      `[calendário] Não foi possível montar o link da sessão "${session.id}": ` +
        `${erro instanceof Error ? erro.message : String(erro)}`,
    );
    return null;
  }
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
