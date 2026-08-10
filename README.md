# Mês da Tecnologia — Landing Page

Landing page institucional do evento **Mês da Tecnologia** (31/08 a 29/09/2026), da XP Educação —
Pós Tech. Reúne a programação completa do evento: cronograma semanal, avisos, trilhas
especializadas, comunidade no Discord, biblioteca de materiais e FAQ.

---

## Destino de publicação: GitHub Pages com link externo no LMS

Este README documenta o projeto **como ele está hoje**: uma aplicação React com etapa de build.

A página será hospedada em **GitHub Pages** e referenciada como **link externo** dentro do LMS
(Brightspace/D2L). Isso significa que a stack atual (React 19 + TanStack Start + Vite + Nitro)
está **corretamente dimensionada** para o caso de uso — não é necessário compilar para HTML único,
nem reescrever em vanilla.

---

## Para quem só precisa atualizar o conteúdo

Se você é da operação acadêmica e só quer trocar uma data, um link de Zoom ou o nome de um
instrutor, é aqui:

> 📍 **Onde fica o conteúdo:** `<!-- PREENCHER: caminho do arquivo de dados, ex. src/data/evento.ts -->`

Nesse arquivo estão as sessões do cronograma, as trilhas, os avisos, os itens da biblioteca e as
perguntas do FAQ. Você edita o texto, a data e o link — sem mexer em HTML, CSS ou layout.

**Regras importantes ao editar:**

- **Datas em formato ISO** (`2026-09-08T19:00:00-03:00`). O status do card — "Em breve",
  "Confirmado", "Encerrado" — e a liberação do botão "Entrar na Aula" são calculados
  automaticamente a partir dessa data. Não existe campo de status para digitar à mão.
- **Link ainda não definido:** deixe `null`, não deixe string vazia nem `"#"`. O `null` vira botão
  "Em breve" desabilitado; uma string vazia vira link quebrado na cara do aluno.
- Depois de editar, é necessário publicar de novo (ver *Publicação* abaixo). A alteração não vai ao
  ar sozinha.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TanStack Start |
| Roteamento | TanStack Router |
| Build | Vite 8 (+ Nitro no build de produção) |
| Linguagem | TypeScript (modo `strict`) |
| Estilo | Tailwind CSS 4 |
| Componentes | shadcn/ui (estilo *new-york*) sobre Radix UI |
| Ícones | lucide-react |
| Gerenciador de pacotes | **Bun** |
| Origem | Projeto conectado ao [Lovable](https://lovable.dev) |

> **Sobre o Lovable:** commits enviados à branch conectada sincronizam de volta para o editor.
> Não reescreva histórico já publicado (`force push`, `rebase`, `amend` ou `squash` de commits já
> enviados) — isso corrompe o histórico do lado do Lovable. Ver `AGENTS.md`.

---

## Rodando localmente

**Pré-requisito:** [Bun](https://bun.sh) instalado.

```bash
bun install
bun dev          # servidor de desenvolvimento
```

| Script | O que faz |
|---|---|
| `bun dev` | Servidor de desenvolvimento com hot reload |
| `bun run build` | Build de produção |
| `bun run build:dev` | Build com variáveis de desenvolvimento |
| `bun run preview` | Serve localmente o resultado do build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier em todo o projeto |

> ⚠️ **Use apenas Bun.** O repositório contém `bun.lock` *e* `package-lock.json` — resquício de dois
> gerenciadores diferentes. Isso faz a mesma dependência resolver em versões distintas dependendo
> de quem instalou. O `package-lock.json` deve ser removido; o `bunfig.toml` confirma que a
> intenção do projeto é Bun.

O `bunfig.toml` também aplica uma proteção de cadeia de suprimentos: pacotes publicados há menos de
24 horas são ignorados na instalação. Para liberar exceção, é preciso adicionar o pacote em
`minimumReleaseAgeExcludes` — **confirme com o time antes de fazer isso.**

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

O botão "Entrar na Aula" fica ativo a partir de **~15 minutos antes** do horário de início da
sessão. Essa regra está anunciada ao aluno no próprio FAQ da página ("Como acessar o evento ao
vivo?"), então mudar a janela sem atualizar o texto do FAQ deixa a página mentindo.

### Estados do card de sessão

O status é derivado da data da sessão, nunca digitado:

| Momento | Badge | Botão |
|---|---|---|
| Antes da janela de liberação | `EM BREVE` (âmbar) | "Entrar na Aula" — contorno, desabilitado |
| A partir de ~15 min antes, durante a sessão | `CONFIRMADO` (verde) | "Entrar na Aula (Zoom)" — verde sólido, ativo |
| Depois do término | `ENCERRADO` (cinza) | "Assistir Replay" — escuro |

Sessões encerradas ganham a marcação "✓ Sessão Concluída" e exibem os links de apoio: Slides da
Aula, Repositório GitHub e Discussão na Comunidade.

### Materiais bloqueados

Cards da Biblioteca marcados como bloqueados exibem badge `EM BREVE` e botão "Bloqueado". O botão
precisa estar **efetivamente desabilitado** (`disabled` / `aria-disabled`), não apenas com
opacidade reduzida — caso contrário o leitor de tela continua anunciando o elemento como clicável.

---

## Identidade visual

| Elemento | Cor |
|---|---|
| Verde primário (botões, badges, destaques) | `#00C852` |
| Texto principal | `#212121` |
| Texto secundário | `#808692` |
| Texto terciário | `#9CA0AA` |
| Borda de cards | `#D4D6DA` |
| Fundo de seção alternada | `#F4F6F9` |
| Destaque vermelho (hero) | `#C40404` |

O tom `#00C852` foi mantido próximo ao `#00c46a` já usado nos demais widgets do Brightspace da XP,
garantindo consistência de marca.

> ⚠️ **Atenção ao contraste.** `#00C852` sobre branco tem contraste de aproximadamente **1,8:1** —
> muito abaixo do mínimo de 4,5:1 exigido pela WCAG AA para texto. Ele é seguro como **fundo de
> botão com texto escuro**, mas **não** como cor de texto. Onde o protótipo usa verde em texto
> (rótulos "Semana N", eyebrows de seção, texto de botão com contorno), é necessário um tom mais
> escuro da mesma família. Ver *Pendências conhecidas*.

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

**Hospedagem:** GitHub Pages  
**Branch de deploy:** `main` (push automático desencadeia build)  
**Destino no LMS:** Link externo em widget ou página do curso  

O `vite.config.ts` atualmente indica build via Nitro com Cloudflare como target padrão. Para
GitHub Pages, isso pode precisar de ajuste (output: 'static' em vez de SSR). Confirmar:

- [ ] Vite config já está configurado para saída estática (GitHub Pages) ou precisa de ajuste
- [ ] GitHub Actions está configurado para build + deploy automático em push
- [ ] URL pública é conhecida (ex: `https://xp-educacao.github.io/mes-da-tecnologia/`)
- [ ] Link externo está no LMS como referência à URL pública acima

---

## Compatibilidade

Testado nos navegadores padrão da instituição (Chrome e Edge).

---

XP Educação · Pós Tech · Mês da Tecnologia 2026
