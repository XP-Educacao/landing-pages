/**
 * ============================================================================
 *  calendar.js — CAMADA DE LÓGICA
 * ============================================================================
 *
 *  Papel na arquitetura (três camadas):
 *
 *    1. DADOS         aulas.json    → única fonte de verdade sobre as aulas
 *    2. LÓGICA        calendar.js   → ESTE ARQUIVO
 *    3. APRESENTAÇÃO  pagina.html   → cards livres; o botão só carrega data-aula-id
 *
 *  Como se relacionam: o HTML declara QUAIS aulas existem na página (pelo
 *  data-aula-id dos botões), o JSON diz O QUE cada aula é, e este arquivo faz a
 *  ponte — casa um com o outro e monta a URL do Google Calendar.
 *
 *  ⚠️  REGRA DE ESCALABILIDADE: adicionar uma aula nova exige editar apenas
 *      aulas.json e criar o card no HTML. Este arquivo NÃO deve ser tocado.
 *      Se você precisou mexer aqui para adicionar uma aula, algo saiu do
 *      contrato — provavelmente um campo novo que deveria ser opcional.
 *
 *  Sobre a divisão "aula" x "evento": as funções que conversam com o Google
 *  falam de `evento` genérico ({ titulo, descricao, local, inicio, fim }) e não
 *  sabem o que é uma aula. Isso permite reaproveitá-las para webinars, lives e
 *  eventos institucionais sem alteração. Só as funções de borda
 *  (carregarAulas, validarIdsDeAulas, inicializarBotoes) conhecem "aula".
 *
 *  ⚠️  LIMITAÇÃO AO ABRIR COMO file:// — leia antes de testar:
 *      `fetch()` de arquivo local é bloqueado por CORS em todos os navegadores
 *      modernos (Chrome, Edge, Firefox e Safari). Abrir pagina.html com duplo
 *      clique NÃO carrega o aulas.json. Suba um servidor estático na pasta:
 *
 *          python -m http.server 8000
 *
 *      e acesse http://localhost:8000/pagina.html
 *
 *      Quando isso acontece, `carregarAulas()` detecta o caso e explica no
 *      console em vez de falhar com uma mensagem genérica de rede.
 */

"use strict";

window.Agenda = (function () {
  /** Caminho do arquivo de dados, relativo à página que carrega este script. */
  const CAMINHO_AULAS = "./aulas.json";

  /** Classe que marca os botões de adicionar à agenda no HTML. */
  const SELETOR_BOTOES = ".btn-add-calendar";

  const BASE_GOOGLE_CALENDAR = "https://calendar.google.com/calendar/render";

  /** Prefixo das mensagens de console, para filtrar fácil no DevTools. */
  const LOG = "[agenda]";

  /**
   * Ambiente de desenvolvimento, detectado sem build step nem variável de
   * ambiente — só o que o navegador já sabe sobre a URL atual.
   *
   * Usado para mostrar sinais visuais de erro (outline vermelho) que ajudam quem
   * está montando a página, sem nunca vazar esse ruído para o aluno em produção.
   */
  function estaEmDesenvolvimento() {
    const { protocol, hostname } = window.location;
    return (
      protocol === "file:" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "" ||
      hostname.endsWith(".local")
    );
  }

  /**
   * Converte uma data ISO 8601 para o formato que a URL do Google exige:
   * AAAAMMDDTHHMMSSZ (sempre em UTC, indicado pelo "Z" no fim).
   *
   * POR QUE O JSON EXIGE TIMEZONE EXPLÍCITO ("-03:00"):
   * sem o offset, `new Date("2026-09-01T19:00:00")` é interpretado como hora
   * LOCAL do navegador. Um aluno em Lisboa criaria o evento às 19h de Lisboa —
   * quatro horas antes da aula real. Com o offset, a string representa um
   * instante absoluto, e a conversão para UTC dá o mesmo resultado em qualquer
   * lugar do mundo. O Google então mostra o evento no fuso de cada pessoa.
   *
   * @param {string} isoString - ex: "2026-09-01T19:00:00-03:00"
   * @returns {string} ex: "20260901T220000Z"
   * @throws {TypeError|RangeError} se a entrada não for uma data válida
   */
  function formatDateForGoogle(isoString) {
    if (typeof isoString !== "string" || isoString.trim() === "") {
      throw new TypeError(
        `${LOG} formatDateForGoogle: esperava uma string ISO 8601, recebeu ${JSON.stringify(isoString)}.`,
      );
    }

    const data = new Date(isoString);
    if (Number.isNaN(data.getTime())) {
      throw new RangeError(
        `${LOG} formatDateForGoogle: "${isoString}" não é uma data ISO 8601 válida. ` +
          `Formato esperado: 2026-09-01T19:00:00-03:00`,
      );
    }

    // Não é erro fatal — a data funciona —, mas o resultado passa a depender do
    // fuso de quem abre a página, o que é quase sempre um descuido de cadastro.
    if (!/(Z|[+-]\d{2}:?\d{2})$/.test(isoString.trim())) {
      console.warn(
        `${LOG} A data "${isoString}" não tem timezone explícito. Ela será lida no fuso do ` +
          `navegador do visitante, então o horário do evento pode sair errado para quem está ` +
          `em outro fuso. Prefira "2026-09-01T19:00:00-03:00".`,
      );
    }

    // toISOString() já entrega UTC: "2026-09-01T22:00:00.000Z".
    // Tiramos separadores e milissegundos para chegar em "20260901T220000Z".
    return data
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  }

  /**
   * Monta a URL de template do Google Calendar para um evento QUALQUER.
   *
   * Deliberadamente agnóstica: não sabe o que é uma aula, não lê o DOM e não
   * faz requisição. Recebe dados, devolve string — dá para testar no console
   * chamando com um objeto literal.
   *
   * @param {{titulo: string, inicio: string, fim: string, descricao?: string, local?: string}} evento
   * @returns {string} URL pronta para abrir
   * @throws {TypeError|RangeError} se faltar campo obrigatório ou a data for inválida
   */
  function gerarLinkGoogleCalendar(evento) {
    if (!evento || typeof evento !== "object") {
      throw new TypeError(
        `${LOG} gerarLinkGoogleCalendar: esperava um objeto de evento, recebeu ${JSON.stringify(evento)}.`,
      );
    }

    const faltando = ["titulo", "inicio", "fim"].filter((campo) => !evento[campo]);
    if (faltando.length > 0) {
      throw new TypeError(
        `${LOG} gerarLinkGoogleCalendar: campos obrigatórios ausentes: ${faltando.join(", ")}. ` +
          `Evento recebido: ${JSON.stringify(evento)}`,
      );
    }

    const inicio = formatDateForGoogle(evento.inicio);
    const fim = formatDateForGoogle(evento.fim);

    // Fim antes do início gera um evento inválido que o Google aceita calado e o
    // usuário só descobre olhando a agenda. Melhor barrar aqui.
    if (new Date(evento.fim) <= new Date(evento.inicio)) {
      throw new RangeError(
        `${LOG} gerarLinkGoogleCalendar: "fim" (${evento.fim}) deve ser depois de ` +
          `"inicio" (${evento.inicio}).`,
      );
    }

    // URLSearchParams faz o escape correto de acentos, "&", "#" e quebras de
    // linha que apareçam no título ou na descrição. Montar a query com
    // concatenação de string quebraria a URL no primeiro "&" de um texto.
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: evento.titulo,
      details: evento.descricao ?? "",
      location: evento.local ?? "",
      sf: "true",
      output: "xml",
    });

    // `dates` é anexado à mão, fora do URLSearchParams, para preservar a barra
    // entre início e fim. O URLSearchParams a escaparia como %2F — que decodifica
    // para "/" e na prática funciona, mas a documentação do Google mostra a barra
    // literal, e barra é caractere válido em valor de query (RFC 3986). Assim a
    // URL fica idêntica ao formato oficial, sem depender desse detalhe.
    return `${BASE_GOOGLE_CALENDAR}?${params.toString()}&dates=${inicio}/${fim}`;
  }

  /**
   * Lê o aulas.json e devolve o array de aulas.
   *
   * Cada modo de falha tem mensagem própria: "não carregou" sem dizer o motivo
   * obriga quem mantém a página a adivinhar entre arquivo movido, JSON com
   * vírgula sobrando e bloqueio de file://.
   *
   * @returns {Promise<Array<object>>} array de aulas, ou [] se algo falhou
   */
  async function carregarAulas() {
    let resposta;

    try {
      resposta = await fetch(CAMINHO_AULAS);
    } catch (erro) {
      // Falha de rede/CORS. O caso mais comum de longe é abrir a página como
      // file://, então tratamos essa hipótese primeiro em vez de mostrar o
      // "Failed to fetch" cru, que não diz o que fazer.
      if (window.location.protocol === "file:") {
        console.error(
          `${LOG} Não foi possível ler ${CAMINHO_AULAS} porque a página foi aberta como ` +
            `arquivo local (file://), e os navegadores bloqueiam fetch nesse modo.\n` +
            `Rode um servidor estático nesta pasta e acesse por http://localhost:\n\n` +
            `    python -m http.server 8000\n\n` +
            `Depois abra http://localhost:8000/pagina.html`,
        );
      } else {
        console.error(`${LOG} Falha de rede ao buscar ${CAMINHO_AULAS}: ${erro.message}`);
      }
      return [];
    }

    if (!resposta.ok) {
      console.error(
        `${LOG} O servidor respondeu ${resposta.status} (${resposta.statusText}) para ` +
          `${CAMINHO_AULAS}. Confirme se o arquivo está na mesma pasta da página.`,
      );
      return [];
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch (erro) {
      console.error(
        `${LOG} ${CAMINHO_AULAS} não é um JSON válido: ${erro.message}\n` +
          `Causas comuns: vírgula sobrando depois do último item, aspas simples no lugar de ` +
          `duplas, ou comentário // dentro do arquivo (JSON não aceita comentários).`,
      );
      return [];
    }

    if (!Array.isArray(dados)) {
      console.error(
        `${LOG} ${CAMINHO_AULAS} precisa conter um array de aulas no nível raiz, mas veio ` +
          `${typeof dados}. O arquivo deve começar com "[" e terminar com "]".`,
      );
      return [];
    }

    return dados;
  }

  /**
   * Confere, no carregamento da página, se todo data-aula-id do HTML existe no
   * JSON — e se o JSON não tem ids repetidos.
   *
   * POR QUE VALIDAR NO LOAD E NÃO SÓ NO CLIQUE:
   * um id com erro de digitação (típico de copiar um card e esquecer de trocar o
   * id) só apareceria quando alguém clicasse naquele botão específico. Numa
   * página com dez aulas, o defeito poderia passar pela revisão e chegar em
   * produção. Validando no load, o problema aparece na primeira vez que a página
   * é aberta, ainda no desenvolvimento.
   *
   * @param {Array<object>} aulas
   * @returns {{orfaos: string[], duplicados: string[]}} resumo, útil para teste
   */
  function validarIdsDeAulas(aulas) {
    const idsDoJson = new Set();
    const duplicados = [];

    for (const aula of aulas) {
      if (!aula || typeof aula.id !== "string" || aula.id.trim() === "") {
        console.warn(
          `${LOG} Há uma aula sem "id" utilizável no JSON: ${JSON.stringify(aula)}. ` +
            `Nenhum botão conseguirá referenciá-la.`,
        );
        continue;
      }
      // .find() devolve sempre o primeiro resultado, então um id repetido faz a
      // segunda aula ficar inalcançável — falha silenciosa clássica.
      if (idsDoJson.has(aula.id)) duplicados.push(aula.id);
      idsDoJson.add(aula.id);
    }

    if (duplicados.length > 0) {
      console.warn(
        `${LOG} ids repetidos em aulas.json: ${duplicados.join(", ")}. ` +
          `Só a primeira ocorrência de cada um será usada. ` +
          `Siga a convenção aula-{tema}-{numero} para manter os ids únicos.`,
      );
    }

    const botoes = document.querySelectorAll(SELETOR_BOTOES);
    if (botoes.length === 0) {
      console.warn(
        `${LOG} Nenhum elemento com a classe "${SELETOR_BOTOES.slice(1)}" foi encontrado na ` +
          `página. Os botões de agenda não vão funcionar até receberem essa classe.`,
      );
    }

    const orfaos = [];
    const dev = estaEmDesenvolvimento();

    botoes.forEach((botao) => {
      const id = botao.dataset.aulaId;

      if (!id) {
        orfaos.push("(sem data-aula-id)");
        console.warn(
          `${LOG} Botão de agenda sem atributo data-aula-id:`,
          botao,
          `\nSem o id não há como saber a qual aula ele se refere.`,
        );
      } else if (!idsDoJson.has(id)) {
        orfaos.push(id);
        console.warn(
          `${LOG} O botão aponta para data-aula-id="${id}", que não existe em aulas.json. ` +
            `Provável erro de digitação ao duplicar um card, ou a aula ainda não foi cadastrada. ` +
            `Ids disponíveis: ${[...idsDoJson].join(", ")}`,
        );
      }

      // Sinal visual só em desenvolvimento: em produção seria ruído para o aluno.
      if (dev && (!id || !idsDoJson.has(id))) {
        botao.style.outline = "2px solid red";
        botao.style.outlineOffset = "2px";
        botao.title = `[dev] data-aula-id inválido: ${id ?? "ausente"}`;
      }
    });

    // Ajuda a manter o campo "ativo" em dia sem policiar automaticamente: quem
    // decide encerrar uma aula é a operação, não o código.
    if (dev) {
      const agora = new Date();
      aulas
        .filter((aula) => aula.ativo !== false && aula.fim && new Date(aula.fim) < agora)
        .forEach((aula) => {
          console.info(
            `${LOG} A aula "${aula.id}" terminou em ${aula.fim} mas segue ativa. ` +
              `Considere marcar "ativo": false para desabilitar o botão sem apagar o registro.`,
          );
        });
    }

    return { orfaos, duplicados };
  }

  /**
   * Liga o clique de cada botão à aula correspondente.
   *
   * @param {Array<object>} aulas
   */
  function inicializarBotoes(aulas) {
    document.querySelectorAll(SELETOR_BOTOES).forEach((botao) => {
      const id = botao.dataset.aulaId;
      const aula = aulas.find((item) => item.id === id);

      // Aula encerrada: desabilita em vez de esconder, para que a página continue
      // mostrando que aquela aula existiu.
      if (aula && aula.ativo === false) {
        botao.disabled = true;
        botao.setAttribute("aria-disabled", "true");
        botao.title = "Esta aula já foi realizada";
        return;
      }

      botao.addEventListener("click", () => {
        // Rebuscamos aqui em vez de usar o `aula` do closure porque o clique pode
        // acontecer muito depois do load, e assim a checagem de erro fica junto
        // da ação que o usuário acabou de fazer.
        const alvo = aulas.find((item) => item.id === botao.dataset.aulaId);

        if (!alvo) {
          console.error(
            `${LOG} Clique ignorado: nenhuma aula com id "${botao.dataset.aulaId}" em aulas.json. ` +
              `A página segue funcionando; corrija o data-aula-id do botão ou cadastre a aula.`,
          );
          return;
        }

        let url;
        try {
          url = gerarLinkGoogleCalendar(alvo);
        } catch (erro) {
          // Um cadastro ruim derruba só este botão, nunca a página inteira.
          console.error(
            `${LOG} Não foi possível montar o link da aula "${alvo.id}": ${erro.message}`,
          );
          return;
        }

        // noopener impede que a aba aberta acesse esta página via window.opener.
        window.open(url, "_blank", "noopener");
      });
    });
  }

  /**
   * Ponto de entrada: carrega os dados, valida e liga os botões.
   * É isso que a página chama.
   *
   * @returns {Promise<Array<object>>} as aulas carregadas
   */
  async function inicializar() {
    const aulas = await carregarAulas();

    const status = document.querySelector("[data-agenda-status]");

    if (aulas.length === 0) {
      // Botão que não faz nada ao clicar é pior do que botão visivelmente
      // indisponível, então desabilitamos todos e dizemos o motivo na tela.
      document.querySelectorAll(SELETOR_BOTOES).forEach((botao) => {
        botao.disabled = true;
        botao.setAttribute("aria-disabled", "true");
      });
      if (status) {
        status.hidden = false;
        status.textContent =
          "Não foi possível carregar a lista de aulas. Veja o console do navegador para o motivo.";
      }
      return aulas;
    }

    if (status) status.hidden = true;

    validarIdsDeAulas(aulas);
    inicializarBotoes(aulas);

    return aulas;
  }

  // Exposto para a página e para inspeção manual no console do DevTools.
  return {
    inicializar,
    carregarAulas,
    validarIdsDeAulas,
    inicializarBotoes,
    gerarLinkGoogleCalendar,
    formatDateForGoogle,
  };
})();
