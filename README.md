# Mês da Tecnologia — Landing Page

Landing page institucional do evento **Mês da Tecnologia** (31/08 a 29/09/2026), da XP Educação —
Pós Tech. Reúne a programação completa do evento: cronograma semanal, avisos, trilhas
especializadas, comunidade no Discord, biblioteca de materiais e FAQ.

---

## Destino de publicação: GitHub Pages com link externo no LMS

A página é uma **SPA estática** (React renderizado no navegador, sem servidor). O build gera
HTML/CSS/JS puro na pasta `docs/`, que é exatamente o que o GitHub Pages serve. É referenciada como
**link externo** dentro do LMS (Brightspace/D2L).

Não há SSR, Node.js nem função serverless em produção — apenas arquivos estáticos.

---

## Para quem só precisa atualizar o conteúdo

Se você é da operação acadêmica e só quer trocar uma data, um link ou o nome de um instrutor, são
**dois arquivos** — e só eles:

| Arquivo | O que fica lá |
|---|---|
| 📍 `src/data/links.ts` | **Todas as URLs**: comunidade (Discord), calendário, materiais, replay, redes sociais |
| 📍 `src/data/event.ts` | **Todos os textos e datas**: sessões, trilhas, avisos, biblioteca, FAQ, rodapé |

Você edita texto, data e link — sem tocar em HTML, CSS ou layout.

### Trocar um link

Abra `src/data/links.ts`. É um objeto único, tudo em um lugar:

```ts
export const links = {
  community: "https://discord.gg/ZfM3sFWrw",  // botão "Entrar na Comunidade"
  calendar: "#",                              // botão "Adicionar ao Calendário"
  materials: { slides: "#", replay: "#", repo: "#", extra: "#" },
  social: { instagram: "#", youtube: "#", linkedin: "#" },
} as const;
```

Links do Zoom são a exceção: ficam no campo `zoomUrl` de cada sessão em `event.ts`, porque são
específicos por aula.

**Regras importantes ao editar:**

- **Datas em formato ISO** (`2026-09-08T19:00:00-03:00`). O status do card — "Em breve",
  "Confirmado", "Concluído" — e a liberação do botão "Entrar na Aula" são calculados
  automaticamente a partir dessa data. Não existe campo de status para digitar à mão.
- **Zoom ainda não definido:** deixe `zoomUrl: ""` (string vazia). Isso mantém o botão desabilitado
  mesmo dentro da janela de liberação — evita link quebrado na cara do aluno.
- **Sessão que cobre vários dias:** use `dateLabel` para sobrescrever a data exibida
  (ex. `dateLabel: "15/09 a 19/09"` nas trilhas). Sem isso, o card mostra apenas o dia de início.
- Depois de editar, é necessário rodar o build e publicar (ver *Publicação* abaixo). A alteração
  **não** vai ao ar sozinha.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 (SPA — renderização no cliente) |
| Roteamento | TanStack Router |
| Build | Vite 8 → saída estática em `docs/` |
| Linguagem | TypeScript (modo `strict`) |
| Estilo | Tailwind CSS 4 |
| Componentes | shadcn/ui (estilo *new-york*) sobre Radix UI |
| Ícones | lucide-react |
| Hospedagem | GitHub Pages (arquivos estáticos) |

---

## Estrutura de arquivos

```
index.html              Entry HTML — meta tags, title, OG (SEO fica aqui)
src/
  main.tsx              Monta o React no #root
  router.tsx            Instancia o TanStack Router
  routes/
    __root.tsx          Layout raiz + telas de 404 e erro
    index.tsx           A landing page (as 8 seções, na ordem)
  data/
    links.ts            ★ TODAS as URLs (fonte única)
    event.ts            ★ Textos, datas, sessões, FAQ
    helpers.ts          Cálculo de status e formatação de data/hora
    mappers.ts          status → badge, ícone → componente
  components/
    event/              Componentes da página (SessionCard, Faq, ui)
    ui/                 shadcn/ui (biblioteca base)
  styles.css            Design system (variáveis de cor em oklch)
docs/                   ← Build de produção. Gerado, mas commitado (GitHub Pages serve daqui)
```

Os arquivos marcados com ★ são os únicos que a operação acadêmica precisa editar.

---

## Rodando localmente

```bash
npm install
npm run dev
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload (porta 5173) |
| `npm run build` | Build de produção → gera `docs/` |
| `npm run preview` | Serve localmente o conteúdo de `docs/` (simula o GitHub Pages) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier em todo o projeto |

> ⚠️ **Dois lockfiles no repositório.** Existem `bun.lock` *e* `package-lock.json`. A mesma
> dependência pode resolver em versões diferentes dependendo de quem instalou. Escolher um
> gerenciador e apagar o lockfile do outro é uma pendência aberta — ver *Pendências conhecidas*.

---

## Estrutura da página

1. **Hero** — título, subtítulo, período do evento, formato (Zoom + gravações) e dois CTAs
2. **Faixa de avisos** — 4 avisos numerados: acesso ao Zoom, publicação de links, materiais em até
   24h, certificado em até 5 dias úteis
3. **Cronograma** — sessões agrupadas por semana, com tema por semana:
   - Semana 1 — IA aplicada ao trabalho do profissional de tecnologia
   - Semana 2 — Tendências e mercado
   - Semana 3 — Trilhas especializadas (grid: Arquitetura de Software, Engenharia de Dados,
     Segurança da Informação, Data Science & Machine Learning)
   - Semana 4 — Encerramento (mesa-redonda e AMA)
4. **Exemplo visual** — card demonstrativo de sessão concluída, com replay e materiais liberados
5. **Comunidade** — Discord oficial, com 5 benefícios de participação
6. **Biblioteca de conteúdo** — slides, replays, repositórios e materiais complementares
7. **FAQ** — accordion com 4 perguntas
8. **Rodapé** — identidade da marca e contato de suporte

---

## Regras de negócio

Estas regras são **especificação do protótipo**, não detalhe de implementação. Alterá-las muda o
comportamento acordado com a área acadêmica.

### Liberação do botão de aula

O botão "Entrar na Aula" fica ativo a partir de **15 minutos antes** do horário de início e
permanece ativo até o fim da sessão (`início + durationMinutes`).

A janela está definida em um único lugar — a constante `LIVE_WINDOW_MINUTES` em
`src/data/helpers.ts`. Ela também está **anunciada ao aluno no FAQ** da página ("Como acessar o
evento ao vivo?"): mudar a constante sem atualizar o texto do FAQ deixa a página mentindo.

Além da janela de tempo, o botão só ativa se a sessão tiver `zoomUrl` preenchido. Sessão sem link
continua desabilitada mesmo no horário — de propósito.

### Estados do card de sessão

O status é derivado da data (`getSessionStatus`), nunca digitado:

| Momento | Badge | Botão "Entrar na Aula" |
|---|---|---|
| Antes de 15 min do início | `Em breve` (âmbar) | desabilitado |
| De 15 min antes até o término | `Confirmado` (verde) | ativo, verde sólido — abre o Zoom |
| Depois do término | `Concluído` (cinza) | desabilitado |

> 📌 **Divergência do protótipo:** o protótipo previa que sessões encerradas trocassem o botão por
> "Assistir Replay" e exibissem links de apoio por sessão. Isso **não** está implementado — o card
> encerrado apenas desabilita o botão. Hoje existe só a seção "Exemplo visual", que é uma
> demonstração estática de como esse estado ficaria. Implementar exigiria um campo de replay por
> sessão em `event.ts`.

### Materiais bloqueados

Cards da Biblioteca marcados como bloqueados exibem badge `EM BREVE` e botão "Bloqueado". O botão
precisa estar **efetivamente desabilitado** (`disabled` / `aria-disabled`), não apenas com
opacidade reduzida — caso contrário o leitor de tela continua anunciando o elemento como clicável.

---

## Identidade visual

As cores são definidas em `src/styles.css` como variáveis CSS em **oklch** (`:root` para o tema
claro, `.dark` para o escuro). Para trocar uma cor, altere a variável — nunca escreva cor literal
em classe de componente.

| Variável | Uso | Equivalente hex |
|---|---|---|
| `--primary` | Fundo de botão, ícones, destaques | `#2CC95D` |
| `--label-accent` | Verde escuro para **texto** ("Semana N") | `#007C18` |
| `--accent-foreground` | Verde de texto sobre fundo verde-claro | `#007E23` |
| `--foreground` | Texto principal | `#262626` |
| `--muted-foreground` | Texto secundário / descrições | `#6A6F77` |
| `--text-tertiary` | Texto terciário | `#5A5E64` |
| `--warning` | Texto do badge "Em breve" | `#B54A00` |
| `--surface-alt` | Fundo de seção alternada | `#F4F6F9` |

O verde de fundo foi mantido próximo ao `#00c46a` já usado nos demais widgets do Brightspace da XP,
garantindo consistência de marca.

> ⚠️ **O verde claro não serve como cor de texto.** `--primary` (`#2CC95D`) tem contraste de
> ~1,9:1 sobre branco. Use-o só como **fundo** de botão com texto escuro. Para verde em texto,
> existem `--label-accent` e `--accent-foreground`, ambos já escurecidos para passar em AA.

### Contraste medido (WCAG AA — mínimo 4,5:1 para texto)

| Combinação | Contraste | |
|---|---|---|
| Texto principal / branco | 15,12:1 | ✅ |
| Botão sólido (texto escuro / verde) | 6,93:1 | ✅ |
| Texto terciário / branco | 6,53:1 | ✅ |
| Rótulo "Semana N" (`label-accent` / branco) | 5,36:1 | ✅ |
| Link verde (`accent-foreground` / branco) | 5,22:1 | ✅ |
| Texto secundário / branco | 5,06:1 | ✅ |
| Badge "Em breve" (`warning` / amarelo-claro) | 4,75:1 | ✅ |
| Texto secundário / `surface-alt` | 4,67:1 | ✅ |
| Badge verde (`accent-foreground` / `accent`) | 4,63:1 | ✅ |

Todas as combinações em uso passam em AA. As margens são estreitas em alguns casos — **clarear
`--muted-foreground` acima de `0.56` ou `--accent-foreground` acima de `0.52` volta a quebrar a
conformidade.** Os limites estão anotados como comentário no próprio `styles.css`.

---

## Acessibilidade

Página institucional de universidade — sujeita a auditoria. Requisitos que devem ser mantidos:

- HTML semântico (`<header>`, `<main>`, `<section>`), com `<h1>` único
- Accordion do FAQ com `<button>` e `aria-expanded` alternando de fato
- Foco visível (`:focus-visible`, contorno de 2px)
- SVG decorativo com `aria-hidden="true"`
- Contraste mínimo de 4,5:1 em texto
- Estados desabilitados desabilitados de verdade, não só visualmente

## Responsividade

Mobile-first. O layout base é escrito para ~320px e cresce por `min-width`. Como a página pode
acabar dentro de um container de largura imprevisível, prefira `clamp()` em tipografia e
`repeat(auto-fit, minmax(…, 1fr))` em grids — assim o layout responde à largura real disponível, e
não à viewport.

---

## Publicação

**Hospedagem:** GitHub Pages, servindo a pasta `/docs` da branch `main`  
**Destino no LMS:** Link externo em widget ou página do curso  

O deploy é manual e tem **dois passos** — o build não roda no servidor:

```bash
npm run build
```

```bash
git add docs && git commit -m "build: atualiza site estático" && git push
```

O `docs/` é build gerado, mas **é commitado de propósito** — é dele que o GitHub Pages serve. Não
adicione `docs` ao `.gitignore`.

### Configuração no GitHub (uma vez só)

Em **Settings → Pages**: Source = `Deploy from a branch`, Branch = `main`, Folder = `/docs`.

### Detalhes que fazem isso funcionar

- `base: "./"` no `vite.config.ts` — gera caminhos relativos, então funciona tanto em
  `usuario.github.io/landing-pages/` quanto localmente. Com o padrão (`/`), os assets dariam 404.
- `public/.nojekyll` — impede o Jekyll do GitHub de ignorar arquivos e pastas que começam com `_`.

---

## Pendências conhecidas

### Funcionalidade prevista no protótipo e não implementada

Sessões encerradas deveriam trocar o botão por "Assistir Replay" e listar materiais por sessão.
Hoje o card encerrado apenas desabilita o botão. Exigiria um campo de replay por sessão em
`event.ts` — ver *Estados do card de sessão*.

### Infraestrutura

- [ ] **Dois lockfiles** (`bun.lock` + `package-lock.json`) — escolher um gerenciador e apagar o outro
- [ ] URL pública confirmada (ex: `https://xp-educacao.github.io/landing-pages/`)
- [ ] Link externo cadastrado no LMS apontando para a URL acima
- [ ] Automatizar o build via GitHub Actions (hoje é manual)

### Links ainda não definidos

Em `src/data/links.ts`, tudo que está como `"#"` continua pendente: calendário, materiais (slides,
replay, repositório, complementares) e as três redes sociais. Os links de Zoom das sessões a partir
da Semana 2 também estão vazios (`zoomUrl: ""`).

---

## Compatibilidade

Testado nos navegadores padrão da instituição (Chrome e Edge).

---

XP Educação · Pós Tech · Mês da Tecnologia 2026
