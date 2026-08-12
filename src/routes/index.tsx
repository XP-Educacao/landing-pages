import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  Instagram,
  Linkedin,
  MessagesSquare,
  Users,
  Youtube,
} from "lucide-react";
import { community, communityBenefits, faq, footer, hero, notices, sections } from "@/data/event";
import { images } from "@/data/images";
import { AGENDA_ANCHOR, links } from "@/data/links";
import { ActionLink, Badge, Section, SectionTitle } from "@/components/event/ui";
import { Agenda } from "@/components/event/Agenda";
import { Banner } from "@/components/event/Banner";
import { Faq } from "@/components/event/Faq";
import { WeeklyClasses } from "@/components/event/WeeklyClasses";

// Meta tags ficam em index.html — o build estático não executa head() no servidor.
export const Route = createFileRoute("/")({
  component: Index,
});

const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
} as const;

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* 0. BANNER */}
      <div className="px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="mx-auto w-full max-w-5xl">
          <Banner image={images.banner} priority className="rounded-2xl" />
        </div>
      </div>

      {/* 1. HERO */}
      <section className="border-b border-border px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {hero.title}
          </h1>
          <div className="mt-5 max-w-3xl space-y-4">
            {hero.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <ActionLink href={`#${AGENDA_ANCHOR}`} variant="solid">
              <CalendarDays className="size-4" aria-hidden="true" />
              {hero.ctaLabel}
            </ActionLink>
          </div>
        </div>
      </section>

      {/* 2. AVISOS */}
      <Section alt>
        <SectionTitle title={sections.notices} />
        <ul className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {notices.map((notice, index) => (
            <li key={notice} className="flex gap-3">
              <span
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{notice}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. AULAS DA SEMANA */}
      <Section>
        <SectionTitle
          title={sections.weeklyClasses}
          subtitle="Escolha a semana para ver as aulas programadas."
        />
        <WeeklyClasses />
      </Section>

      {/* 4. AGENDA DO EVENTO */}
      <Section alt className="scroll-mt-4" id={AGENDA_ANCHOR}>
        <SectionTitle
          title={sections.agenda}
          subtitle="Programação completa das cinco semanas, com materiais e replays por aula."
        />
        <Agenda />
      </Section>

      {/* 5. FAQ */}
      <Section>
        <SectionTitle title={sections.faq} subtitle={`${faq.length} dúvidas frequentes.`} />
        <Faq />
      </Section>

      {/* 6. COMUNIDADE */}
      <Section alt>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle
              title="Comunidade Tech"
              subtitle="Um espaço vivo para trocar com quem está estudando e construindo junto com você."
            />
            <ul className="space-y-3">
              {communityBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0">{benefit}</span>
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
              <ActionLink href={links.community} variant="solid" className="w-full sm:w-auto">
                <Users className="size-4" aria-hidden="true" />
                {community.buttonLabel}
              </ActionLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. RODAPÉ */}
      <footer className="border-t border-border bg-surface-alt px-4 py-10 sm:px-6">
        <div className="mx-auto grid w-full max-w-5xl gap-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-lg font-bold text-foreground">{footer.brand}</p>
          <ul className="flex gap-4">
            {Object.entries(links.social).map(([name, url]) => {
              const Icon = socialIcons[name as keyof typeof socialIcons];
              const label = name.charAt(0).toUpperCase() + name.slice(1);
              return (
                <li key={name}>
                  <a
                    href={url}
                    aria-label={label}
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
