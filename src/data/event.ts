/**
 * ============================================================
 *  CONTEÚDO EDITÁVEL — XPE Community Tech
 *  Textos, datas, títulos, instrutores e links por sessão.
 *  URLs globais (comunidade, redes) ficam em src/data/links.ts.
 *  Imagens ficam em src/data/images.ts.
 *
 *  O status de cada sessão ("Em breve" / "Confirmado" / "Concluído")
 *  é DERIVADO de dateTime — não existe campo para digitar à mão.
 * ============================================================
 */

export type SessionStatus = "confirmado" | "em-breve" | "concluido";

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
  dateRange: string;
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
    dateRange: "31/08 a 01/09",
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
        instructor: "Leandro César Lopes Evangelista",
        zoomUrl: "https://zoom.us/pt/signin?ampDeviceId=06fa4e29-5075-4b13-b7f8-9153b940a425&ampSessionId=undefined&_ics=1779237884085&irclickid=~69d60QIyCxCwxzDuwxnvlcd~e945a-eka94WXMNJCrmkif~21YVL&_gl=1*e9vcdm*_gcl_au*ODQ3MTA4OTEuMTc3OTIzNzg4Mg..#/login",
        registrationUrl: "",
        materialsUrl: "",
        replayUrl: "",
      },
      {
        id: "s1-2",
        category: "Workshop",
        dateTime: "2026-09-01T19:00:00-03:00",
        durationMinutes: 90,
        title: "Como Empresas Constroem Agentes de IA",
        description:
          "Acompanhe a construção de um agente de IA do zero e descubra como equipes de tecnologia desenvolvem aplicações modernas utilizando modelos de linguagem e integrações com ferramentas externas.",
        instructor: "Marcelo César",
        zoomUrl: "",
        registrationUrl: "",
        materialsUrl: "",
        replayUrl: "",
      },
    ],
  },
  {
    id: "semana-2",
    label: "Semana 2",
    dateRange: "08/09",
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
        instructor: "Silas Liu",
        zoomUrl: "",
        registrationUrl: "",
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
        instructor: "Silas Liu",
        zoomUrl: "",
        registrationUrl: "",
        materialsUrl: "",
        replayUrl: "",
      },
    ],
  },
  {
    id: "semana-3",
    label: "Semana 3",
    dateRange: "15/09 a 22/09",
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
        zoomUrl: "",
        registrationUrl: "",
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
        zoomUrl: "",
        registrationUrl: "",
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
        zoomUrl: "",
        registrationUrl: "",
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
        zoomUrl: "",
        registrationUrl: "",
        materialsUrl: "",
        replayUrl: "",
      },
    ],
  },
  {
    id: "semana-4",
    label: "Semana 4",
    dateRange: "29/09",
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
        instructor: "André Souza",
        // Sem registrationUrl: a inscrição desta sessão acontece pelo próprio link do Zoom.
        zoomUrl: "",
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
        instructor: "André Souza",
        zoomUrl: "",
        registrationUrl: "",
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
  badge: "Discord Oficial",
  title: "Comunidade XPE Community Tech",
  text: "O ponto de encontro dos estudantes e do time de professores durante todo o evento — e depois dele.",
  buttonLabel: "Entrar na Comunidade",
};

export const faq = [
  {
    question: "Como acessar o evento ao vivo?",
    answer:
      "Todos os encontros serão realizados via Zoom. O link de acesso de cada sessão já estará disponível nesta página. Recomendamos que você copie o link e adicione-o à sua agenda para facilitar o acesso no horário do evento. Também enviaremos lembretes por e-mail antes de cada encontro.",
  },
  {
    question: "Como entrar na Comunidade?",
    answer:
      "Clique em “Entrar na Comunidade” nesta página. Você será direcionado ao servidor oficial no Discord, onde acontecem as discussões, desafios e avisos do evento.",
  },
  {
    question: "Como funciona o certificado de participação?",
    answer:
      "O certificado é enviado por e-mail em até 5 dias úteis após o encerramento do evento, considerando a presença registrada nas sessões ao vivo.",
  },
  {
    question: "Onde encontro os materiais complementares e replays?",
    answer:
      "Nos próprios cards de cada aula, na Agenda do Evento. Os botões “Acessar Materiais” e “Replay” são liberados em até 24 horas após cada sessão.",
  },
];

export const footer = {
  brand: "XPE Community Tech",
  institutional: "XP Educação | Pós Tech • XPE Community Tech 2026",
  support: "Suporte ao Aluno: suporte@xpeducacao.com.br",
};
