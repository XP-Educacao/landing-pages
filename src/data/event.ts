/**
 * ============================================================
 *  CONTEÚDO EDITÁVEL — Mês da Tecnologia
 *  Altere datas, títulos, instrutores, links e status aqui.
 *  Nenhuma alteração de HTML/CSS é necessária.
 * ============================================================
 */

export type SessionStatus = "confirmado" | "em-breve" | "concluido";

export type Session = {
  id: string;
  category: string;
  status: SessionStatus;
  date: string;
  time?: string;
  title: string;
  description: string;
  instructor?: string;
  /** Link do Zoom. Deixe vazio ("") para manter o botão desabilitado. */
  zoomUrl: string;
  /** true = botão "Entrar na Aula" ativo (libera ~15min antes da sessão). */
  live: boolean;
  ctaLabel: string;
};

export const hero = {
  title: "Mês da Tecnologia",
  subtitle:
    "Inteligência Artificial, Tendências e Carreira para Profissionais de Tecnologia. Um ciclo exclusivo de imersões práticas com especialistas do mercado.",
  period: "31 de Agosto a 29 de Setembro",
  format: "Ao vivo via Zoom e Gravações",
  communityUrl: "https://discord.gg/",
  calendarUrl: "#",
};

export const notices = [
  "Todas as sessões acontecem ao vivo via Zoom.",
  "Os links do Zoom são disponibilizados nesta página.",
  "Materiais de apoio e códigos publicados em até 24h após cada aula.",
  "Certificados disponíveis na plataforma em até 5 dias úteis após o evento.",
];

export const opening: Session = {
  id: "abertura",
  category: "Evento",
  status: "confirmado",
  date: "31/08 · Segunda",
  time: "19h às 20h30",
  title: "O que realmente é fluência em IA para os profissionais de tecnologia",
  description:
    "Uma abertura direta ao ponto sobre o que muda no dia a dia de quem constrói software quando a IA deixa de ser hype e vira ferramenta de trabalho.",
  instructor: "Prof. André Souza",
  zoomUrl: "https://zoom.us/",
  live: true,
  ctaLabel: "Entrar na Aula (Zoom)",
};

export type WeekBlock = {
  label: string;
  theme: string;
  layout: "single" | "duo" | "grid";
  sessions: Session[];
};

export const weeks: WeekBlock[] = [
  {
    label: "Semana 1",
    theme: "Construindo com IA",
    layout: "single",
    sessions: [
      {
        id: "s1-1",
        category: "Workshop",
        status: "confirmado",
        date: "01/09 · Terça",
        time: "19h às 21h",
        title: "Construindo um agente de IA do zero",
        description:
          "Mão na massa: da definição de ferramentas ao loop de raciocínio, construindo um agente funcional em tempo real.",
        instructor: "Prof. Vinicius Marinho",
        zoomUrl: "https://zoom.us/",
        live: true,
        ctaLabel: "Entrar na Aula (Zoom)",
      },
    ],
  },
  {
    label: "Semana 2",
    theme: "Produto e Tendências",
    layout: "duo",
    sessions: [
      {
        id: "s2-1",
        category: "Palestra",
        status: "em-breve",
        date: "08/09 · Terça",
        time: "19h às 20h30",
        title: "Como empresas estão redesenhando produtos com IA",
        description:
          "Casos reais de reposicionamento de produto e o impacto na rotina dos times de engenharia.",
        instructor: "Convidado Especial",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
      {
        id: "s2-2",
        category: "Palestra",
        status: "em-breve",
        date: "09/09 · Quarta",
        time: "19h às 20h30",
        title: "As tecnologias que todo profissional deveria acompanhar em 2026",
        description:
          "Um panorama sobre o que realmente vale a atenção do seu tempo de estudo no próximo ciclo.",
        instructor: "Convidado Especial",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
    ],
  },
  {
    label: "Semana 3",
    theme: "Trilhas Exclusivas · 15/09 a 19/09",
    layout: "grid",
    sessions: [
      {
        id: "s3-1",
        category: "Trilha Exclusiva",
        status: "em-breve",
        date: "15/09 a 19/09",
        title: "Arquitetura de Software",
        description: "Padrões, trade-offs e decisões que sustentam sistemas em escala.",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
      {
        id: "s3-2",
        category: "Trilha Exclusiva",
        status: "em-breve",
        date: "15/09 a 19/09",
        title: "Engenharia de Dados",
        description: "Pipelines confiáveis, qualidade de dados e arquitetura moderna.",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
      {
        id: "s3-3",
        category: "Trilha Exclusiva",
        status: "em-breve",
        date: "15/09 a 19/09",
        title: "Segurança da Informação",
        description: "Ameaças atuais, defesa em profundidade e cultura de segurança.",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
      {
        id: "s3-4",
        category: "Trilha Exclusiva",
        status: "em-breve",
        date: "15/09 a 19/09",
        title: "Data Science & Machine Learning",
        description: "Do experimento ao modelo em produção, com métricas que importam.",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
    ],
  },
  {
    label: "Semana 4",
    theme: "Carreira e Comunidade",
    layout: "duo",
    sessions: [
      {
        id: "s4-1",
        category: "Mesa-redonda",
        status: "em-breve",
        date: "27/09 · Domingo",
        time: "19h às 20h30",
        title: "O futuro da carreira tech",
        description:
          "Profissionais de diferentes senioridades discutem caminhos, escolhas e o que esperar dos próximos anos.",
        instructor: "Convidado Especial",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
      {
        id: "s4-2",
        category: "AMA",
        status: "em-breve",
        date: "29/09 · Terça",
        time: "19h às 20h30",
        title: "Pergunte qualquer coisa",
        description:
          "Encerramento aberto: traga suas dúvidas sobre estudo, carreira, IA e mercado.",
        instructor: "Convidado Especial",
        zoomUrl: "",
        live: false,
        ctaLabel: "Entrar na Aula",
      },
    ],
  },
];

export const exampleSession = {
  title: "Modelagem de Dados para Escala Global em NoSQL",
  description:
    "Sessão concluída com materiais completos liberados: slides, código-fonte e espaço de discussão com a turma.",
  materials: [
    { label: "Slides da Aula", url: "#" },
    { label: "Repositório GitHub", url: "#" },
    { label: "Discussão na Comunidade", url: "#" },
  ],
  replayUrl: "#",
};

export const communityBenefits = [
  "Fazer networking qualificado",
  "Compartilhar projetos práticos",
  "Tirar dúvidas técnicas",
  "Participar de desafios de código",
  "Receber conteúdos exclusivos",
];

export const community = {
  badge: "Discord Oficial",
  title: "Comunidade Pós Tech",
  text: "O ponto de encontro dos estudantes e do time de professores durante todo o Mês da Tecnologia — e depois dele.",
  buttonLabel: "Entrar na Comunidade",
  url: "https://discord.gg/",
};

export type LibraryItem = {
  icon: "slides" | "replay" | "repo" | "extra";
  title: string;
  description: string;
  released: boolean;
  url: string;
};

export const library: LibraryItem[] = [
  {
    icon: "slides",
    title: "Slides Completos",
    description: "Apresentações de todas as sessões já realizadas em PDF.",
    released: true,
    url: "#",
  },
  {
    icon: "replay",
    title: "Replays das Aulas",
    description: "Gravações completas para assistir no seu ritmo.",
    released: true,
    url: "#",
  },
  {
    icon: "repo",
    title: "Repositórios",
    description: "Códigos-fonte e projetos construídos ao vivo nas aulas.",
    released: false,
    url: "#",
  },
  {
    icon: "extra",
    title: "Complementares",
    description: "Leituras, artigos e referências indicadas pelos professores.",
    released: false,
    url: "#",
  },
];

export const faq = [
  {
    question: "Como acessar o evento ao vivo?",
    answer:
      "Todos os encontros acontecem via Zoom. O botão “Entrar na Aula” fica ativo aproximadamente 15 minutos antes do início de cada sessão, aqui mesmo nesta página. O link também é enviado por e-mail e divulgado na Comunidade Tech no Discord.",
  },
  {
    question: "Como entrar na Comunidade Tech?",
    answer:
      "Clique em “Entrar na Comunidade” em qualquer seção desta página. Você será direcionado ao servidor oficial no Discord, onde acontecem as discussões, desafios e avisos do evento.",
  },
  {
    question: "Como funciona o certificado de participação?",
    answer:
      "O certificado é liberado na plataforma em até 5 dias úteis após o encerramento do evento, considerando a presença registrada nas sessões ao vivo.",
  },
  {
    question: "Onde encontro os materiais complementares e replays?",
    answer:
      "Na seção “Biblioteca de Conteúdo” desta página. Slides, códigos e gravações são publicados em até 24 horas após cada aula.",
  },
];

export const footer = {
  brand: "XP Pós Tech",
  institutional: "XP Educação | Pós Tech • Mês da Tecnologia 2026",
  support: "Suporte ao Aluno: suporte@xpeducacao.com.br",
  social: [
    { label: "Instagram", url: "#" },
    { label: "YouTube", url: "#" },
    { label: "LinkedIn", url: "#" },
  ],
};