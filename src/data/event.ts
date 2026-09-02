/**
 * ============================================================
 *  CONTEÚDO EDITÁVEL — XPE Community Tech
 *  Textos, datas, títulos, instrutores e links por sessão.
 *  URLs globais (comunidade, redes) ficam em src/data/links.ts.
 *  Imagens ficam em src/data/images.ts.
 *
 *  O badge de cada card é fixo em "Confirmado" (src/data/mappers.ts).
 *  Já a disponibilidade dos botões é DERIVADA de dateTime + durationMinutes,
 *  pelas regras em src/data/helpers.ts — não existe campo para digitar à mão.
 * ============================================================
 */

/**
 * Convenção dos campos de URL (registrationUrl, materialsUrl, replayUrl):
 *   - campo ausente  → o botão não aparece no card
 *   - string vazia "" → o botão aparece desabilitado (conteúdo ainda não liberado)
 *   - URL preenchida  → o botão aparece ativo
 */
export type Session = {
  id: string;
  /** Rótulo do tipo de sessão (ex: "Workshop", "Demonstração técnica"). */
  category: string;
  /** Início em ISO 8601 com fuso (ex: "2026-08-31T19:00:00-03:00"). */
  dateTime: string;
  durationMinutes: number;
  /** Sobrescreve a data exibida. Use em sessões que cobrem um intervalo. */
  dateLabel?: string;
  title: string;
  /** Parágrafo descritivo. */
  description?: string;
  /** Linha "Tema: …" — usada nas trilhas da Semana 3, que não têm parágrafo. */
  topic?: string;
  instructor?: string;
  /** Link do Zoom. Vazio ("") mantém o botão desabilitado. */
  zoomUrl: string;
  /** Sobrescreve o rótulo padrão "Entrar na Aula (Zoom)". */
  zoomLabel?: string;
  registrationUrl?: string;
  materialsUrl?: string;
  replayUrl?: string;
  /** Observação exibida no pé do card (ex: aviso sobre inscrição). */
  note?: string;
};

/** Rótulo padrão do botão de acesso à aula. */
export const DEFAULT_ZOOM_LABEL = "Entrar na Aula (Zoom)";

/**
 * Rótulo do mesmo botão depois que a aula termina.
 *
 * O link continua clicável — o que muda é só o texto, para deixar claro que a
 * transmissão ao vivo já passou. Sobrescreve também um `zoomLabel` próprio da
 * sessão, porque a informação "encerrada" vale mais que o rótulo customizado.
 */
export const ENDED_ZOOM_LABEL = "Aula encerrada";

/** Títulos das seções da página. */
export const sections = {
  notices: "Avisos Importantes sobre o evento",
  weeklyClasses: "Aulas da Semana",
  agenda: "Agenda do Evento",
  faq: "FAQ do Evento",
} as const;

export const hero = {
  title: "Bem-vindo ao XPE Community Tech!",
  paragraphs: [
    "O primeiro evento oferecido pela Comunidade de Pós-Graduação da XP Educação, criado para conectar você com especialistas, professores convidados e os temas mais relevantes do universo da tecnologia.",
    "Ao longo dos próximos dias, você terá acesso a uma programação exclusiva com debates, workshops, demonstrações técnicas e estudos de caso sobre Inteligência Artificial, Engenharia, Arquitetura de Software, Dados, Segurança e Carreira.",
    "Além dos encontros ao vivo, este evento marca o início da nossa comunidade, um espaço para ampliar seu networking, compartilhar conhecimento e manter o aprendizado ativo além da sala de aula.",
  ],
  ctaLabel: "Acessar Agenda",
};

export const notices = [
  "Todas as sessões acontecerão ao vivo via Zoom.",
  "Os links do Zoom serão disponibilizados nesta página.",
  "Os materiais de apoio e códigos serão publicados em até 24h após cada aula.",
  "Os certificados de participação serão enviados via e-mail com prazo de 5 dias úteis.",
];

export type WeekBlock = {
  id: string;
  /** Ex: "Semana 1" */
  label: string;
  /** Datas da semana, exibidas na aba (ex: "31/08 a 01/09"). */

  /** Tema da semana, exibido na Agenda. */
  theme: string;
  /** "stack" = cards em largura cheia · "grid" = duas colunas. */
  layout: "stack" | "grid";
  sessions: Session[];
};

export const weeks: WeekBlock[] = [
  {
    id: "semana-1",
    label: "Semana 1",

    theme: "IA aplicada ao trabalho do profissional de tecnologia",
    layout: "stack",
    sessions: [
      {
        id: "s1-1",
        category: "Demonstrações",
        dateTime: "2026-08-31T19:00:00-03:00",
        durationMinutes: 90,
        title: "O que realmente é fluência em IA para os profissionais de tecnologia",
        description:
          "Entenda como a IA está mudando o mercado de tecnologia e quais habilidades serão essenciais para profissionais que desejam se destacar nos próximos anos.",
        instructor: "Mauricio Brito",
        zoomUrl: "https://us06web.zoom.us/meeting/register/EU-1kFzLR6-uctFEGjcE2Q",
        registrationUrl: "https://us06web.zoom.us/meeting/register/EU-1kFzLR6-uctFEGjcE2Q",
        materialsUrl: "https://ava.xpeducacao.com.br/d2l/le/enhancedSequenceViewer/7826?url=https%3A%2F%2F31b3293b-2f2a-4c20-ae81-70694e5d5ddc.sequences.api.brightspace.com%2F7826%2Factivity%2F88650%3FfilterOnDatesAndDepth%3D1",
        replayUrl: "https://ava.xpeducacao.com.br/content/enforced/7826-XPE-COM-Tech26/replay-31-09.html",
      },
      {
        id: "s1-2",
        category: "Workshop",
        dateTime: "2026-09-01T19:00:00-03:00",
        durationMinutes: 90,
        title: "Como Empresas Constroem Agentes de IA",
        description:
          "Acompanhe a construção de um agente de IA do zero e descubra como equipes de tecnologia desenvolvem aplicações modernas utilizando modelos de linguagem e integrações com ferramentas externas.",
        instructor: "Moíses Luna",
        zoomUrl: "https://us06web.zoom.us/meeting/register/3A5n5rp0Ti2ITowgjgQoVg",
        registrationUrl: "https://us06web.zoom.us/meeting/register/3A5n5rp0Ti2ITowgjgQoVg",
        materialsUrl: "https://ava.xpeducacao.com.br/d2l/le/enhancedSequenceViewer/7826?url=https%3A%2F%2F31b3293b-2f2a-4c20-ae81-70694e5d5ddc.sequences.api.brightspace.com%2F7826%2Factivity%2F88660%3FfilterOnDatesAndDepth%3D1",
        replayUrl: "https://ava.xpeducacao.com.br/content/enforced/7826-XPE-COM-Tech26/replay-01-09.html",
      },
    ],
  },
  {
    id: "semana-2",
    label: "Semana 2",

    theme: "Tendências e Mercado para 2026",
    layout: "stack",
    sessions: [
      {
        id: "s2-1",
        category: "Estudo de caso",
        dateTime: "2026-09-08T19:00:00-03:00",
        durationMinutes: 90,
        title: "Como empresas estão redesenhando produtos com IA",
        description:
          "Descubra como empresas estão incorporando Inteligência Artificial para transformar produtos, criar novas experiências e acelerar a inovação. Um estudo de caso com exemplos reais, decisões estratégicas e os principais aprendizados de quem já está colocando IA no centro do negócio.",
        instructor: "",
        zoomUrl: "https://us06web.zoom.us/meeting/register/Oi3vxSaERIGJN3q9bDR2Sg",
        registrationUrl: "https://us06web.zoom.us/meeting/register/Oi3vxSaERIGJN3q9bDR2Sg",
        materialsUrl: "",
        replayUrl: "",
      },
      {
        id: "s2-2",
        category: "Painel com especialista",
        dateTime: "2026-09-08T19:00:00-03:00",
        durationMinutes: 90,
        title: "As tecnologias que todo profissional de tecnologia deveria acompanhar",
        description:
          "Conheça as tecnologias, tendências e movimentos que especialistas acreditam que vão impactar o mercado nos próximos anos. Um painel para entender o que vale acompanhar desde já e como se preparar para o futuro da carreira em tecnologia.",
        instructor: "",
        zoomUrl: "https://us06web.zoom.us/meeting/register/dXYflu0dSR2Plxj1Bj6JEA",
        registrationUrl: "https://us06web.zoom.us/meeting/register/dXYflu0dSR2Plxj1Bj6JEA",
        materialsUrl: "",
        replayUrl: "",
      },
    ],
  },
  {
    id: "semana-3",
    label: "Semana 3",

    theme: "Trilhas Especializadas por Pós-Graduação",
    layout: "grid",
    sessions: [
      {
        id: "s3-1",
        category: "Demonstração técnica",
        dateTime: "2026-09-15T19:00:00-03:00",
        durationMinutes: 90,
        title: "Arquitetura de Software e Soluções",
        topic:
          "Arquiteturas AI Native: como projetar aplicações preparadas para Inteligência Artificial",
        zoomUrl: "https://us06web.zoom.us/meeting/register/ncahSpcoTs6kLFVsw09SwQ",
        registrationUrl: "https://us06web.zoom.us/meeting/register/ncahSpcoTs6kLFVsw09SwQ",
        materialsUrl: "",
        replayUrl: "",
      },
      {
        id: "s3-2",
        category: "Demonstração técnica",
        dateTime: "2026-09-15T19:00:00-03:00",
        durationMinutes: 90,
        title: "Engenharia e Arquitetura de Dados",
        topic: "RAG, bancos vetoriais e engenharia de dados para aplicações inteligentes",
        zoomUrl: "https://us06web.zoom.us/meeting/register/qDltTlr9SDqFULTGyGTMOw",
        registrationUrl: "https://us06web.zoom.us/meeting/register/qDltTlr9SDqFULTGyGTMOw",
        materialsUrl: "",
        replayUrl: "",
      },
      {
        id: "s3-3",
        category: "Demonstração técnica",
        dateTime: "2026-09-22T19:00:00-03:00",
        durationMinutes: 90,
        title: "Segurança da Informação e Cibersegurança",
        topic: "Segurança em aplicações com IA com foco em Prompt Injection, agentes e governança",
        zoomUrl: "https://us06web.zoom.us/meeting/register/QhalR0o_S_WK-dX_L4pECQ",
        registrationUrl: "https://us06web.zoom.us/meeting/register/QhalR0o_S_WK-dX_L4pECQ",
        materialsUrl: "",
        replayUrl: "",
      },
      {
        id: "s3-4",
        category: "Demonstração técnica",
        dateTime: "2026-09-22T19:00:00-03:00",
        durationMinutes: 90,
        title: "Data Science e Machine Learning",
        topic: "IA Generativa em produção para Ciência de Dados e aplicações inteligentes",
        zoomUrl: "https://us06web.zoom.us/meeting/register/GYyOtjHKS7KxE0I_Mq-I8A",
        registrationUrl: "https://us06web.zoom.us/meeting/register/GYyOtjHKS7KxE0I_Mq-I8A",
        materialsUrl: "",
        replayUrl: "",
      },
    ],
  },
  {
    id: "semana-4",
    label: "Semana 4",

    theme: "Carreira e futuro do profissional de tecnologia",
    layout: "stack",
    sessions: [
      {
        id: "s4-1",
        category: "Mesa redonda",
        dateTime: "2026-09-29T19:00:00-03:00",
        durationMinutes: 90,
        title: "Como acelerar sua carreira em tecnologia utilizando IA",
        description:
          "Uma conversa entre profissionais sobre como usar IA para acelerar a carreira em tecnologia: onde ela realmente destrava produtividade, o que muda na rotina dos times e quais escolhas fazem diferença nos próximos anos.",
        instructor: "",
        registrationUrl: "https://us06web.zoom.us/meeting/register/3qloS4-dTw-6l15JU8A1KQ",
        zoomUrl: "https://us06web.zoom.us/meeting/register/3qloS4-dTw-6l15JU8A1KQ",
        zoomLabel: "Acesse a aula no Zoom",
        materialsUrl: "",
        replayUrl: "",
        note: "*Para garantir sua participação se inscreva no link do Zoom.",
      },
      {
        id: "s4-2",
        category: "Asking Me Anything",
        dateTime: "2026-09-29T19:00:00-03:00",
        durationMinutes: 90,
        title: "Especialistas respondem sobre IA, carreira e tendência",
        description:
          "Encerramento aberto a perguntas: traga suas dúvidas sobre IA, estudo, mercado e carreira para responder ao vivo com os especialistas do evento.",
        instructor: "",
        zoomUrl: "https://us06web.zoom.us/meeting/register/i8NcLs25RJmHFm7ejhF25A",
        registrationUrl: "https://us06web.zoom.us/meeting/register/i8NcLs25RJmHFm7ejhF25A",
        materialsUrl: "",
        replayUrl: "",
      },
    ],
  },
];

export const communityBenefits = [
  "Fazer networking qualificado",
  "Compartilhar projetos práticos",
  "Tirar dúvidas técnicas",
  "Participar de desafios de código",
  "Receber conteúdos exclusivos",
];

export const community = {
  badge: "Discord",
  title: "Comunidade XPE Community Tech",
  text: "O ponto de encontro dos estudantes e do time de professores durante todo o evento — e depois dele.",
  buttonLabel: "Entrar na Comunidade",
  /* ══════════════════════════════════════════════════════════════════════
   *  📅 LIBERAÇÃO DO BOTÃO DA COMUNIDADE — ajuste aqui
   *
   *  Antes deste instante o botão fica desabilitado e exibe `pendingLabel`.
   *  A partir dele, volta ao verde e ao texto de `buttonLabel`.
   *
   *  Mesmo formato das aulas: ISO 8601 com o fuso -03:00 explícito. Sem o
   *  fuso, a hora seria lida no relógio de quem abre a página, e a liberação
   *  aconteceria em momentos diferentes para cada visitante.
   * ══════════════════════════════════════════════════════════════════════ */
  releaseDateTime: "2026-08-31T19:00:00-03:00",
  /** Texto enquanto a liberação não chega. */
  pendingLabel: "Em breve",
};

export const faq = [
  {
    question: "Como acessar o evento ao vivo?",
    answer:
      "Todos os encontros são realizados via Zoom. O link de acesso estará disponível 30 minutos antes do início de cada sessão nesta página. Copie o link e adicione à sua agenda. Também enviaremos lembretes por e-mail antes do evento.",
  },
  {
    question: "Como entrar na Comunidade?",
    answer:
      "Durante o evento, você receberá as orientações para acessar a Comunidade. O link estará disponível no ambiente do evento e permitirá que você participe das discussões, acompanhe novidades e se conecte com outros alunos e especialistas.",
  },
  {
    question: "Como funciona o certificado de participação?",
    answer:
      "O certificado será emitido em até 7 dias úteis após o encerramento do evento. Para ter direito à emissão, é necessário participar dos encontros e responder às pesquisas de feedback correspondentes. Após a emissão, as instruções de acesso serão enviadas por e-mail.",
  },
  {
    question: "Onde encontro os materiais complementares e replays?",
    answer:
      "Nos próprios cards de cada aula, na Agenda do Evento. Os botões “Acessar Materiais” e “Replay” são liberados em até 78 horas após cada sessão.",
  },
];

export const footer = {
  brand: "XP Educação Community Tech",
};
