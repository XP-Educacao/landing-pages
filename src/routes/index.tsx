import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  CalendarPlus,
  Check,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Lock,
  MessagesSquare,
  PlayCircle,
  Users,
  Video,
  Youtube,
} from "lucide-react";
import {
  community,
  communityBenefits,
  exampleSession,
  faq,
  footer,
  hero,
  library,
  notices,
  opening,
  weeks,
} from "@/data/event";
import { ActionLink, Badge, Section, SectionTitle } from "@/components/event/ui";
import { SessionCard } from "@/components/event/SessionCard";
import { Faq } from "@/components/event/Faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mês da Tecnologia | XP Pós Tech" },
      {
        name: "description",
        content:
          "IA, tendências e carreira para profissionais de tecnologia. Imersões ao vivo via Zoom de 31/08 a 29/09.",
      },
      { property: "og:title", content: "Mês da Tecnologia | XP Pós Tech" },
      {
        property: "og:description",
        content:
          "Um ciclo exclusivo de imersões práticas com especialistas do mercado, de 31 de agosto a 29 de setembro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const libraryIcons = {
  slides: FileText,
  replay: PlayCircle,
  repo: Github,
  extra: BookOpen,
} as const;

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. HERO */}
      <section className="border-b border-border px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge tone="green">
              <CalendarDays className="size-4" aria-hidden="true" />
              {hero.period}
            </Badge>
            <Badge tone="green">
              <Video className="size-4" aria-hidden="true" />
              {hero.format}
            </Badge>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href={hero.communityUrl} variant="solid">
              <Users className="size-4" aria-hidden="true" />
              Entrar na Comunidade Tech
            </ActionLink>
            <ActionLink href={hero.calendarUrl} variant="outline">
              <CalendarPlus className="size-4" aria-hidden="true" />
              Adicionar ao Calendário
            </ActionLink>
          </div>
        </div>
      </section>

      {/* 2. AVISOS */}
      <Section alt>
        <SectionTitle title="Avisos Importantes" />
        <ul className="grid gap-6 sm:grid-cols-2">
          {notices.map((notice, i) => (
            <li key={notice} className="flex gap-4">
              <span className="text-sm font-bold text-primary" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{notice}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. CRONOGRAMA */}
      <Section>
        <SectionTitle
          title="Sua Jornada de Aprendizado"
          subtitle="Cinco semanas de conteúdo prático, do fundamento à aplicação em produto e carreira."
        />
        <SessionCard session={opening} featured />

        <div className="mt-12 space-y-12">
          {weeks.map((week) => (
            <div key={week.label}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide">
                <span className="text-primary">{week.label}</span>
                <span className="text-text-tertiary"> | {week.theme}</span>
              </h3>
              <div
                className={
                  week.layout === "single"
                    ? "grid gap-5"
                    : "grid gap-5 sm:grid-cols-2"
                }
              >
                {week.sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    compact={week.layout === "grid"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. EXEMPLO VISUAL */}
      <Section alt>
        <p className="mb-5 text-xs font-bold uppercase tracking-wide text-text-tertiary">
          Exemplo visual — Visualização de uma sessão concluída e materiais liberados
        </p>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">
              <Check className="size-3.5" aria-hidden="true" />
              Sessão Concluída
            </Badge>
            <Badge tone="gray">Workshop Encerrado</Badge>
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
            {exampleSession.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {exampleSession.description}
          </p>
          <ul className="mt-5 grid gap-2">
            {exampleSession.materials.map((m) => (
              <li key={m.label}>
                <a
                  href={m.url}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <FileText className="size-4" aria-hidden="true" />
                  {m.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ActionLink href={exampleSession.replayUrl} variant="solid">
              <PlayCircle className="size-4" aria-hidden="true" />
              Assistir Replay
            </ActionLink>
          </div>
        </article>
      </Section>

      {/* 5. COMUNIDADE */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle
              title="Comunidade Tech"
              subtitle="Um espaço vivo para trocar com quem está estudando e construindo junto com você."
            />
            <ul className="space-y-3">
              {communityBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/40 bg-accent/40 p-7 shadow-[var(--shadow-featured)] sm:p-9">
            <Badge tone="green">
              <MessagesSquare className="size-4" aria-hidden="true" />
              {community.badge}
            </Badge>
            <h3 className="mt-4 text-xl font-bold text-foreground">{community.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{community.text}</p>
            <div className="mt-6">
              <ActionLink href={community.url} variant="solid" className="w-full sm:w-auto">
                <Users className="size-4" aria-hidden="true" />
                {community.buttonLabel}
              </ActionLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. BIBLIOTECA */}
      <Section alt>
        <SectionTitle
          title="Biblioteca de Conteúdo"
          subtitle="Materiais publicados em até 24 horas após cada aula."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {library.map((item) => {
            const Icon = libraryIcons[item.icon];
            return (
              <article
                key={item.title}
                className={`flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] ${
                  item.released ? "" : "opacity-70"
                }`}
              >
                <Icon
                  className={`size-6 ${item.released ? "text-primary" : "text-text-tertiary"}`}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                <div className="mt-2">
                  {item.released ? (
                    <Badge tone="green">Liberado</Badge>
                  ) : (
                    <Badge tone="gray">Em breve</Badge>
                  )}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-5">
                  {item.released ? (
                    <ActionLink href={item.url} variant="solid" className="w-full">
                      Acessar Materiais
                    </ActionLink>
                  ) : (
                    <ActionLink href="#" disabled className="w-full">
                      <Lock className="size-4" aria-hidden="true" />
                      Bloqueado
                    </ActionLink>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* 7. FAQ */}
      <Section>
        <SectionTitle title="FAQ do Estudante" subtitle={`${faq.length} dúvidas frequentes.`} />
        <Faq />
      </Section>

      {/* 8. RODAPÉ */}
      <footer className="border-t border-border bg-surface-alt px-4 py-10 sm:px-6">
        <div className="mx-auto grid w-full max-w-5xl gap-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-lg font-bold text-foreground">{footer.brand}</p>
          <ul className="flex gap-4">
            {footer.social.map((s) => {
              const Icon =
                s.label === "Instagram" ? Instagram : s.label === "YouTube" ? Youtube : Linkedin;
              return (
                <li key={s.label}>
                  <a
                    href={s.url}
                    aria-label={s.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mx-auto mt-6 w-full max-w-5xl border-t border-border pt-6 text-sm text-muted-foreground">
          <p>{footer.institutional}</p>
          <p className="mt-1">{footer.support}</p>
        </div>
      </footer>
    </main>
  );
}
