import { CalendarPlus, Clock, User, Video } from "lucide-react";
import type { Session, SessionStatus } from "@/data/event";
import { getStatusBadge } from "@/data/mappers";
import { formatSessionDate, formatSessionTime } from "@/data/helpers";
import { ActionLink, Badge } from "./ui";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: SessionStatus }) {
  const { tone, label } = getStatusBadge(status);
  return <Badge tone={tone}>{label}</Badge>;
}

export function SessionCard({
  session,
  status,
  featured = false,
  compact = false,
}: {
  session: Session;
  status: SessionStatus;
  featured?: boolean;
  compact?: boolean;
}) {
  // Só libera o Zoom durante a janela ativa (15min antes até o fim da sessão).
  const live = status === "confirmado" && session.zoomUrl !== "";
  const dateText = session.dateLabel ?? formatSessionDate(session.dateTime);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]",
        featured && "border-primary/40 bg-accent/40 p-7 shadow-[var(--shadow-featured)] sm:p-9",
        compact && "p-5",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="green">{session.category}</Badge>
        {compact ? <Badge tone="gray">{dateText}</Badge> : <StatusBadge status={status} />}
      </div>

      {!compact && (
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarPlus className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {dateText}
          </span>
          <span className="inline-flex items-center gap-1.5 font-normal text-muted-foreground">
            <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {formatSessionTime(session.dateTime, session.durationMinutes)}
          </span>
        </p>
      )}

      <h3
        className={cn(
          "mt-3 text-lg font-bold leading-snug text-foreground",
          featured && "text-xl sm:text-2xl",
          compact && "mt-3 text-base",
        )}
      >
        {session.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{session.description}</p>

      {session.instructor ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-text-tertiary">
          <User className="size-4 shrink-0" aria-hidden="true" />
          Ministrado por <span className="font-semibold text-foreground">{session.instructor}</span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 pt-0 [&>*]:w-full sm:[&>*]:w-auto">
        {featured ? (
          <ActionLink href="#" variant="ghost">
            <CalendarPlus className="size-4" aria-hidden="true" />
            Adicionar à agenda
          </ActionLink>
        ) : null}
        <ActionLink
          href={session.zoomUrl || "#"}
          variant={live ? "solid" : "disabled"}
          disabled={!live}
        >
          <Video className="size-4" aria-hidden="true" />
          {session.ctaLabel}
        </ActionLink>
        {featured ? (
          <ActionLink href="#" variant="outline">
            Quero Participar
          </ActionLink>
        ) : null}
      </div>
    </article>
  );
}
