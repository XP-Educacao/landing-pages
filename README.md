# Mês da Tecnologia — Landing Page

Landing page institucional do evento **Mês da Tecnologia** (31/08 a 29/09), desenvolvida para ser embutida como página inicial dentro do Brightspace (D2L), o LMS utilizado pela XP Educação.

O projeto foi desenvolvido com o apoio de IA e entregue como HTML, CSS e JavaScript puro, sem dependência de frameworks ou etapa de build, de modo a garantir compatibilidade com o ambiente de widget/iframe do LMS.

## Sobre o projeto

A página reúne toda a programação do evento: cronograma semanal, avisos importantes, comunidade no Discord, biblioteca de materiais e um FAQ. O conteúdo (datas, instrutores, links e status dos badges) fica centralizado em um único objeto JS no topo do arquivo, permitindo atualização sem alteração da estrutura de HTML/CSS.

### Estrutura da página

1. **Hero** — título, subtítulo, período do evento e CTAs principais
2. **Faixa de avisos** — 4 avisos numerados sobre acesso ao Zoom, materiais e certificado
3. **Cronograma** — card de abertura em destaque e cards organizados por semana (Workshop, Palestra, Trilha Exclusiva, Mesa-redonda, AMA)
4. **Exemplo visual** — card demonstrativo do estado de uma sessão concluída, com materiais liberados
5. **Comunidade (Discord)** — benefícios de participação e CTA de entrada
6. **Biblioteca de conteúdo** — grid com slides, replays, repositórios e materiais complementares
7. **FAQ** — accordion com as perguntas mais frequentes
8. **Rodapé** — identidade da marca e contato de suporte

## Stack

- HTML, CSS e JavaScript puro (vanilla)
- Sem frameworks, sem build, sem dependências externas
- Arquivo único e autocontido

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

O tom `#00C852` foi mantido próximo ao `#00c46a` já utilizado nos demais widgets do Brightspace da XP, garantindo consistência de marca.

## Responsividade e acessibilidade

- Mobile-first, considerando que a página é exibida em containers de largura variável dentro do LMS
- HTML semântico, com `aria-expanded` no FAQ e foco visível em botões e links
- Contraste adequado para leitura em diferentes tamanhos de tela

## Comportamentos dinâmicos

- O botão "Entrar na Aula" alterna entre estado ativo e inativo, simulando a liberação ~15 minutos antes de cada sessão
- Os cards da Biblioteca de Conteúdo marcados como "Bloqueado" permanecem visualmente desabilitados até a liberação

## Compatibilidade

Testado nos navegadores padrão da instituição (Chrome e Edge).

---

XP Educação · Pós Tech · Mês da Tecnologia 2026