import {
  CalendarDays,
  CalendarPlus,
  Clock,
  FileText,
  PlayCircle,
  User,
  UserPlus,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";
import { DEFAULT_ZOOM_LABEL, type Session, type SessionStatus } from "@/data/event";
import { getStatusBadge } from "@/data/mappers";
import { formatSessionDate, formatSessionTime, getSessionCalendarUrl } from "@/data/helpers";
import { ActionLink, Badge } from "./ui";
import { cn } from "@/lib/utils";

/**
 * Botão de ação de uma sessão. Segue a convenção dos campos de URL:
 * campo ausente não renderiza nada; string vazia renderiza desabilitado.
 */
function SessionAction({
  url,
  variant = "soft",
  children,
}: {
  url?: string | undefined;
  variant?: "solid" | "soft";
  children: ReactNode;
}) {
  if (url === undefined) return null;

  const released = url !== "";
  return (
    <ActionLink
      href={released ? url : "#"}
      variant={released ? variant : "disabled"}
      disabled={!released}
    >
      {children}
    </ActionLink>
  );
}

export function SessionCard({
  session,
  status,
  /** "compact" é o card do carrossel de Aulas da Semana: menor e com menos ações. */
  variant = "full",
}: {
  session: Session;
  status: SessionStatus;
  variant?: "full" | "compact";
}) {
  const compact = variant === "compact";

  // Zoom fica ativo quando há URL preenchida
  const zoomAvailable = session.zoomUrl !== "";
  const dateText = session.dateLabel ?? formatSessionDate(session.dateTime);
  const timeText = formatSessionTime(session.dateTime, session.durationMinutes);

  // Aula encerrada não tem o que agendar. Fora disso, `null` significa data mal
  // cadastrada — o adaptador já registrou o motivo no console.
  const calendarUrl = status === "concluido" ? null : getSessionCalendarUrl(session);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]",
        compact ? "p-5" : "p-6 sm:p-7",
      )}
    >
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {dateText}
        </span>
        <span className="inline-flex items-center gap-1.5 font-normal text-muted-foreground">
          <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {timeText}
        </span>
      </p>

      <h3
        className={cn(
          "mt-3 font-bold leading-snug text-foreground",
          compact ? "text-base" : "text-lg sm:text-xl",
        )}
      >
        {session.title}
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone="green">{session.category}</Badge>
        <Badge tone={getStatusBadge(status).tone}>{getStatusBadge(status).label}</Badge>
      </div>

      {session.topic ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Tema:</span> {session.topic}
        </p>
      ) : null}

      {session.description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{session.description}</p>
      ) : null}

      {session.instructor ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-text-tertiary">
          <User className="size-4 shrink-0" aria-hidden="true" />
          Ministrado por <span className="font-semibold text-foreground">{session.instructor}</span>
        </p>
      ) : null}

      {/* Empurra as ações para a base do card, alinhando cards de alturas diferentes. */}
      <div className="mt-auto pt-6">
        <div className="flex flex-wrap gap-3 [&>*]:w-full sm:[&>*]:w-auto">
          <SessionAction url={session.registrationUrl} variant="solid">
            <UserPlus className="size-4" aria-hidden="true" />
            Quero me Inscrever
          </SessionAction>

          <ActionLink
            href={zoomAvailable ? session.zoomUrl : "#"}
            variant="zoom"
            disabled={!zoomAvailable}
          >
            <Video className="size-4" aria-hidden="true" />
            {session.zoomLabel ?? DEFAULT_ZOOM_LABEL}
          </ActionLink>

          {compact ? null : (
            <>
              {/* Abre o Google Calendar com o evento já preenchido (link de
                  template — sem login de API, sem backend). É um link de verdade
                  em vez de window.open para permitir abrir em nova aba, e porque
                  a URL já é conhecida na renderização. */}
              <ActionLink
                href={calendarUrl ?? "#"}
                variant={calendarUrl ? "soft" : "disabled"}
                disabled={!calendarUrl}
              >
                <CalendarPlus className="size-4" aria-hidden="true" />
                Adicionar ao Calendário
              </ActionLink>

              <SessionAction url={session.materialsUrl}>
                <FileText className="size-4" aria-hidden="true" />
                Acessar Materiais
              </SessionAction>
              <SessionAction url={session.replayUrl}>
                <PlayCircle className="size-4" aria-hidden="true" />
                Replay
              </SessionAction>
            </>
          )}
        </div>

        {session.note && !compact ? (
          <p className="mt-4 text-xs leading-relaxed text-text-tertiary">{session.note}</p>
        ) : null}
      </div>
    </article>
  );
}
