import { weeks } from "@/data/event";
import { getSessionStatus } from "@/data/helpers";
import { SessionCard } from "./SessionCard";

/**
 * "Agenda do Evento" — listagem completa, semana a semana.
 *
 * O arranjo dos cards vem de `week.layout` (src/data/event.ts):
 *   "stack" → uma coluna (cards largos)
 *   "grid"  → duas colunas (trilhas da Semana 3)
 */
export function Agenda() {
  return (
    <div className="divide-y divide-border">
      {weeks.map((week, index) => (
        <section
          key={week.id}
          aria-labelledby={`agenda-${week.id}`}
          className={index === 0 ? "pb-12" : "py-12 last:pb-0"}
        >
          <h3 id={`agenda-${week.id}`} className="mb-5 text-sm font-bold uppercase tracking-wide">
            <span className="text-accent-foreground">{week.label}</span>
            <span className="text-text-tertiary"> | {week.theme}</span>
          </h3>

          <div className={week.layout === "grid" ? "grid gap-5 sm:grid-cols-2" : "grid gap-5"}>
            {week.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                status={getSessionStatus(session.dateTime, session.durationMinutes)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
