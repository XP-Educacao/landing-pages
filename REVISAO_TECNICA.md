# Revisão Técnica Completa — Mês da Tecnologia Landing Page

**Data:** 2026-08-10  
**Projeto:** Mês da Tecnologia (XP Pós Tech)  
**Stack:** React 19 + TanStack Start + Vite + Tailwind CSS 4

---

## FASE 1: ENTENDIMENTO ✅

### Estrutura de Rotas (TanStack Router)

```
src/
├── router.tsx              → Criação do router + QueryClient
├── routes/
│   ├── __root.tsx         → Root layout + Error/NotFound boundaries
│   └── index.tsx          → Única rota pública "/" (landing page SPA)
└── routeTree.gen.ts       → Gerado automaticamente pelo plugin @tanstack/router-plugin
```

**Observação:** Projeto é **single-page app** (SPA) com uma única rota pública. Não há rotas dinâmicas (ex: `/eventos/:id`).

---

### Componentes e Organização

```
src/components/
├── event/
│   ├── SessionCard.tsx    → Card de sessão (apresentação + botões)
│   ├── Faq.tsx           → Accordion de FAQ (stateful: open/close)
│   └── ui.tsx            → Componentes reutilizáveis: Badge, Section, SectionTitle, ActionLink
└── ui/                    → Biblioteca shadcn/ui (~40 componentes, na maioria não usados)
```

**Componentes efetivamente em uso:**
- `SessionCard`: Exibe uma sessão (título, data, instrutor, botão Zoom)
- `Badge`: Etiqueta colorida (tones: green, yellow, gray)
- `ActionLink`: Link/botão com variantes (solid, outline, ghost, disabled)
- `Section`: Container com padding/background alternado
- `SectionTitle`: Header de seção (título + subtitle opcional)
- `Faq`: Accordion com estado interno

**Componentes não usados:** 90% da biblioteca shadcn (accordion, alert-dialog, avatar, command, drawer, etc.)

---

### Camada de Dados

**Arquivo:** `src/data/event.ts`

```typescript
// Estrutura principal
hero              → Título, subtítulo, período, links CTA (comunidade, calendário)
notices           → Array de 4 avisos numerados
opening           → Sessão de abertura (type Session)
weeks             → Array de WeekBlock com sessões
community         → Badge, título, link Discord
library           → Array de LibraryItem (slides, replay, repositórios, etc.)
faq               → Array de { question, answer }
footer            → Brand, contato, social links
```

**Type `Session`:**
```typescript
{
  id: string                    // Identificador único
  category: string              // "Workshop", "Palestra", "Trilha Exclusiva", etc.
  status: "confirmado" | "em-breve" | "concluido"  // PROBLEMA: digitado, não derivado
  date: string                  // "31/08 · Segunda" ou "15/09 a 19/09"
  time?: string                 // "19h às 20h30"
  title: string
  description: string
  instructor?: string
  zoomUrl: string              // URL do Zoom (vazio "" para desabilitado)
  live: boolean                // PROBLEMA: duplica lógica que deveria ser derivada de data
  ctaLabel: string
}
```

---

### Derivação de Status (Regra dos 15 Minutos)

**Requisito do protótipo:**
- 15 min **antes** da sessão: botão fica ativo (verde)
- Durante: botão ativo
- Após: botão para "Replay"

**Implementação atual:**
```typescript
// src/components/event/SessionCard.tsx linha 76
disabled={!session.live}
```

- `session.live` é um campo **booleano estático** no JSON
- Não há cálculo dinâmico de data/hora
- A regra dos 15 minutos está **anunciada no FAQ** mas **não implementada**

**Status:** ⚠️ **CRÍTICO** — O requisito de 15 minutos antes é apenas um comentário no código (`src/data/event.ts:22`), mas não existe lógica que o calcule. Mudar a hora de uma sessão não libera o botão automaticamente.

---

### Botões e Links Dinâmicos

| Local | URL | Tipo | Dinâmico? |
|-------|-----|------|-----------|
| Hero - "Entrar na Comunidade Tech" | `hero.communityUrl` | LinkInterno | ❌ Hardcoded em JSON |
| Hero - "Adicionar ao Calendário" | `hero.calendarUrl` | LinkInterno | ❌ Sempre "#" |
| Sessões - "Entrar na Aula (Zoom)" | `session.zoomUrl` | LinkExterno | ✅ Varia por sessão, mas manual |
| Exemplo - "Assistir Replay" | `exampleSession.replayUrl` | LinkInterno | ❌ Sempre "#" |
| Exemplo - Material links | `exampleSession.materials[].url` | Varia | ❌ Todas "#" |
| Comunidade - "Entrar na Comunidade" | `community.url` | LinkInterno | ❌ Hardcoded em JSON |
| Biblioteca - "Acessar Materiais" | `library[].url` | Varia | ❌ Todas "#" |
| Social (footer) | `footer.social[].url` | LinkExterno | ❌ Todas "#" |

**Problema:** URLs estão dispersas em 6+ lugares do arquivo `event.ts`, cada um com um padrão diferente. Alterar a URL do Discord requer buscar em múltiplos locais.

---

## FASE 2: DIAGNÓSTICO 🔍

### Problemas de Código

#### 1. **Status hardcoded, não derivado**
```typescript
// ❌ ERRADO: Campo estático
{ status: "em-breve", ... }

// ✅ CERTO: Seria calculado de 'date'
const status = derived(dateTime): "em-breve" | "confirmado" | "concluido"
```

**Impacto:** Impossível automatizar transições de status. Requer edição manual do JSON toda vez que uma sessão muda de estado.

**Localização:** `src/data/event.ts`, linhas 44-209 (todos os 14+ sessions)

---

#### 2. **Campo `live` duplica lógica de data**
```typescript
// ❌ ERRADO: Dois campos significam a mesma coisa
{ date: "31/08 · Segunda", time: "19h às 20h30", live: true, ... }

// ✅ CERTO: Um único campo
{ dateTime: "2026-08-31T19:00:00-03:00", ... }
// live = dateTime - now < 15 minutes && dateTime + duration > now
```

**Impacto:** Risco de inconsistência (date diz X, live diz Y). Requer manutenção dupla.

---

#### 3. **URLs espalhadas e sem padrão**

**Espalhamento:**
- `hero.communityUrl` → linha 33
- `hero.calendarUrl` → linha 34
- `session.zoomUrl` → linha 54+ (em cada session)
- `exampleSession.replayUrl` → linha 220
- `exampleSession.materials[].url` → linha 216-219
- `community.url` → linha 236
- `library[].url` → linha 247-276
- `footer.social[].url` → linha 305-309

**Problema:** Difícil centralizar mudança de um único link (ex: Discord).

---

#### 4. **Repetição de código em index.tsx**

```typescript
// Mapeamento de ícones da biblioteca (linhas 56-61)
const libraryIcons = {
  slides: FileText,
  replay: PlayCircle,
  repo: Github,
  extra: BookOpen,
} as const;

// PROBLEMA: Mesma lógica se repete no componente
// SessionCard (StatusBadge, lines 6-10) também mapeia status → Badge color
```

**Impacto:** Mudança de uma badge requer editar em múltiplos arquivos.

---

#### 5. **Componente ActionLink não semântico**
```typescript
// src/components/event/ui.tsx, linhas 63-92
if (disabled) {
  return <span aria-disabled="true" className={...}> {/* ✅ Correto */}
}
return <a href={href}> {/* ✅ Correto */}
```

**Status:** ✅ Bem implementado (usa `<span>` para disabled, `<a>` para ativo).

---

#### 6. **SessionCard: lógica de renderização acoplada**
```typescript
// Linhas 30-31: Renderização de badge condicional
{compact ? <Badge tone="gray">{session.date}</Badge> : <StatusBadge status={session.status} />}

// PROBLEMA: A lógica "se compacto, mostra data; senão status"
// está hardcoded no JSX, difícil de alterar
```

---

### Problemas de Acessibilidade (WCAG)

#### 1. **Contraste insuficiente em vários elementos**

| Elemento | Cor Foreground | Cor Background | Contraste | WCAG AA (4.5:1) | Status |
|----------|---|---|---|---|---|
| Badge "em breve" (texto amarelo) | `#E49921` | `#FCF4C5` | 2.12:1 | ❌ FALHA | 🚨 |
| Texto terciário em branco | `#9CA0AA` | branco | 2.67:1 | ❌ FALHA | 🚨 |
| Texto terciário em surface-alt | `#9CA0AA` | `#F4F6F9` | 2.46:1 | ❌ FALHA | 🚨 |
| Rótulo "Semana 1" em cor primária | seria ≈1.8:1 em texto | — | ❌ FALHA | 🚨 |
| Badge "em breve" (texto verde em fundo claro) | `#06A240` | `#DFF8E6` | 3.26:1 | ✅ PASSA | ✅ |
| Botão sólido verde | `#2C595D` (texto) | `#2CC95D` (bg) | 6.93:1 | ✅ PASSA | ✅ |

**Localização problemas:**
- Badge tons yellow/gray: `src/components/event/ui.tsx:19-20`
- Classe `text-text-tertiary`, `text-muted-foreground`: `src/routes/index.tsx` múltiplas linhas
- Rótulo "Semana N": `src/routes/index.tsx:125` (seria em cor primária)

---

#### 2. **Estados desabilitados**

**Status:** ✅ Correto — usa `aria-disabled="true"` e `<span>` em vez de `<button disabled>`.

```typescript
// src/components/event/ui.tsx:76-82
if (disabled) {
  return <span aria-disabled="true" className={cn(buttonStyles.disabled, className)}>
```

---

#### 3. **FAQ Accordion**
```typescript
// src/components/event/Faq.tsx:17-21
<button
  aria-expanded={expanded}
  aria-controls={`faq-panel-${i}`}
  onClick={() => setOpen(expanded ? null : i)}
>
```

**Status:** ✅ Correto — `aria-expanded` alterna corretamente, `aria-controls` presente.

---

### Divergências do Protótipo Figma

**Mencionado no README (linhas 154-161):**
> "⚠️ Atenção ao contraste. `#00C852` sobre branco tem contraste de aproximadamente **1,8:1** — muito abaixo do mínimo de 4,5:1 exigido pela WCAG AA para texto."

**Rótulos afetados:**
- "Semana 1", "Semana 2", etc. (linha 125 do index.tsx)
- Eyebrow "Exemplo visual" (linha 150)
- Qualquer texto que use cor primária diretamente

**Solução recomendada no README:** "Usar um tom mais escuro da mesma família"

**Status:** 🚨 **IDENTIFICADO mas NÃO RESOLVIDO** — o README reconhece o problema, mas o código ainda usa cores inadequadas.

---

### Questões de Manutenção

#### Alterar URL do Discord hoje:
1. Editar `hero.communityUrl` em `event.ts`
2. Editar `community.url` em `event.ts`
3. Testar link em duas seções

**Problema:** Não fica claro que são o mesmo link. Se alguém esquecer um, a página fica inconsistente.

#### Adicionar nova sessão:
1. Adicionar objeto Session em `event.ts`
2. Decidir manualmente `status` e `live`
3. Adivinhar formato da `date` string
4. Se houver regra dos 15 minutos, não funciona automaticamente

---

### Resumo FASE 2

| Problema | Severidade | Impacto |
|----------|-----------|--------|
| Status não derivado de data | 🔴 Crítico | Impossível automatizar mudança de estado |
| Campo `live` redundante | 🔴 Crítico | Risco de inconsistência data/live |
| URLs dispersas sem padrão | 🟠 Alto | Difícil centralizar mudanças |
| Contraste WCAG insuficiente | 🟠 Alto | Auditoria de acessibilidade vai falhar |
| Código repetido (mapeamentos) | 🟡 Médio | Manutenção frágil |
| Lógica acoplada em JSX | 🟡 Médio | Mudanças de UX exigem tocar lógica |

---

## FASE 3: PLANEJAMENTO 📋

### Objetivo de Refatoração

**Fim:** Código pronto para manutenção por pessoal técnico ou não-técnico  
**Estrutura:** URLs centralizadas, status automático, componentes desacoplados  
**Funcionalidade:** Sem mudanças visuais, sem risco de quebra  

---

### Refactorings Prioritários (em ordem de execução)

#### **P1: Centralizar URLs** (impacto imediato)

**Novo arquivo:** `src/data/links.ts`
```typescript
export const links = {
  community: {
    discord: "https://discord.gg/...",
    benefits: ["networking", "projetos", "dúvidas", "desafios", "conteúdo"]
  },
  materials: {
    slides: "#",      // URLs para Slides Completos
    replay: "#",      // URLs para Replays
    repo: "#",        // URLs para Repositórios
    extra: "#"        // URLs para Complementares
  },
  calendar: "#",
  social: {
    instagram: "#",
    youtube: "#",
    linkedin: "#"
  }
} as const;
```

**Benefício:** Alterar URL do Discord em um lugar.

---

#### **P2: Refatorar `Session` para usar `dateTime` ISO**

**Antes:**
```typescript
{ date: "31/08 · Segunda", time: "19h às 20h30", status: "confirmado", live: true, ... }
```

**Depois:**
```typescript
{ dateTime: "2026-08-31T19:00:00-03:00", durationMinutes: 90, ... }
```

**Função auxiliar:**
```typescript
export function getSessionStatus(
  dateTimeISO: string,
  durationMinutes: number,
  now = new Date()
): "em-breve" | "confirmado" | "concluido" {
  const start = new Date(dateTimeISO);
  const fifteenMinutesBefore = new Date(start.getTime() - 15 * 60 * 1000);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  
  if (now < fifteenMinutesBefore) return "em-breve";
  if (now >= fifteenMinutesBefore && now < end) return "confirmado";
  return "concluido";
}

export function isSessionLive(dateTimeISO: string, durationMinutes: number): boolean {
  return getSessionStatus(dateTimeISO, durationMinutes) === "confirmado";
}
```

**Localização:** `src/data/event.ts` (nova seção de helpers)

---

#### **P3: Remover mapeamentos duplicados**

**Consolidar em:** `src/data/mappers.ts` (novo arquivo)
```typescript
import { FileText, PlayCircle, Github, BookOpen, Check } from "lucide-react";
import type { Session, LibraryItem } from "./event";

export const statusBadges = {
  confirmado: { tone: "green" as const, label: "Confirmado" },
  "em-breve": { tone: "yellow" as const, label: "Em breve" },
  concluido: { tone: "gray" as const, label: "Concluído" }
} as const;

export const libraryIcons = {
  slides: FileText,
  replay: PlayCircle,
  repo: Github,
  extra: BookOpen
} as const;

export function formatSessionDate(dateTimeISO: string, showTime = true): string {
  // Exemplo output: "31/08 · Segunda" ou "31/08 · Segunda · 19h"
  // ...
}
```

**Benefício:** Um único ponto para mudar cores/labels de badges.

---

#### **P4: Refatorar SessionCard para aceitar dados computados**

**Antes:**
```typescript
export function SessionCard({ session, featured = false, compact = false })
```

**Depois:**
```typescript
export function SessionCard({
  session,
  computedStatus,     // ← Recebe status já calculado
  featured = false,
  compact = false
})
```

**Benefício:** Componente não precisa entender lógica de data. Index.tsx computa status uma vez.

---

#### **P5: Melhorar tipagem**

**Adicionar:** `src/types/index.ts`
```typescript
export type Environment = "development" | "staging" | "production";
export type LinkKey = keyof typeof links;
export type SessionId = string & { readonly __brand: "SessionId" };

export function sessionId(value: string): SessionId {
  return value as SessionId;
}
```

**Benefício:** Refactor-safe. Se uma URL for removida, TypeScript avisa.

---

### Estrutura Final

```
src/
├── data/
│   ├── event.ts          ← Sessões, notices, footer (apenas dados)
│   ├── links.ts          ← URLs centralizadas
│   ├── mappers.ts        ← Mapeamentos de ícones/labels/cores
│   └── helpers.ts        ← getSessionStatus(), formatSessionDate(), etc.
├── types/
│   └── index.ts          ← TypeScript types com branding
├── components/
│   ├── event/
│   │   ├── SessionCard.tsx    ← Recebe status pré-computado
│   │   ├── Faq.tsx            ← Sem mudanças
│   │   └── ui.tsx             ← Sem mudanças
│   └── ui/ (shadcn) → Sem mudanças
└── routes/
    └── index.tsx         ← Computa status, passa para SessionCard
```

---

## FASE 4: IMPLEMENTAÇÃO 🔨

(Será executada na próxima seção)

**Plano:**
1. Criar `src/data/links.ts` com todas as URLs centralizadas
2. Criar `src/data/helpers.ts` com `getSessionStatus()`, `formatSessionDate()`
3. Criar `src/data/mappers.ts` com mapeamentos de ícones e cores
4. Refatorar todas as Sessions em `event.ts` para usar `dateTime` ISO
5. Refatorar `SessionCard.tsx` para receber status pré-computado
6. Atualizar `routes/index.tsx` para usar novos helpers
7. Ajustar cores de contraste WCAG (tema: cor mais escura para texto)
8. Testes manuais no navegador
9. Gerar documentação final

---

## FASE 5: VALIDAÇÃO

(Será executada após FASE 4)

- [ ] Dev server rodando sem erros
- [ ] Visual idêntico ao original
- [ ] Links funcionando (Discord, materiais, etc.)
- [ ] Badges mostrando status correto
- [ ] Contraste WCAG em ✅
- [ ] README atualizado com estrutura final
- [ ] Relatório de mudanças

---

**Próximo passo:** Iniciar FASE 4 (Implementação)
