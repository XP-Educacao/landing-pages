# Adicionar Aula ao Google Agenda

Botão que abre o Google Calendar já preenchido com os dados de uma aula, usando **link de
template** — sem OAuth, sem API key, sem backend.

## Como testar

`fetch()` de arquivo local é bloqueado por CORS em **todos** os navegadores modernos, então abrir
`pagina.html` com duplo clique não funciona. Suba um servidor estático nesta pasta:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000/pagina.html`.

> Se preferir não usar servidor, a alternativa é trocar o `aulas.json` por um `aulas.js` que faça
> `window.AULAS = [...]` e carregá-lo com `<script>`. Perde-se o JSON puro, mas funciona em
> `file://`. O código atual assume o JSON.

## Arquitetura em três camadas

```
aulas.json     DADOS         única fonte de verdade sobre as aulas
    ↓
calendar.js    LÓGICA        casa id do HTML com dado do JSON e monta a URL
    ↓
pagina.html    APRESENTAÇÃO  cards de layout livre; o botão só carrega data-aula-id
```

O HTML declara **quais** aulas existem na página (pelos `data-aula-id`), o JSON diz **o que** cada
aula é, e o `calendar.js` faz a ponte.

### Por que separar assim

Um único contrato liga as camadas: o `data-aula-id`. Isso permite que o layout de cada card mude
livremente sem risco de quebrar a agenda, e que a data de uma aula seja corrigida em um só lugar.

**Nenhum dado da aula é escrito no HTML.** Data no HTML viraria uma segunda fonte de verdade, que
sai de sincronia com o JSON na primeira alteração de agenda — e ninguém percebe, porque as duas
continuam "funcionando".

## Adicionar uma aula

Dois passos, e **nunca** mexer no `calendar.js`:

1. Cadastre a aula no `aulas.json`
2. Copie um card no `pagina.html` e troque o `data-aula-id`

Se você precisou editar o `calendar.js` para adicionar uma aula, algo saiu do contrato — provavelmente
um campo novo que deveria ser opcional.

## Formato do `aulas.json`

JSON puro não aceita comentários, então o formato está documentado aqui.

| Campo | Obrigatório | Descrição |
|---|---|---|
| `id` | sim | Identificador único. Convenção: `aula-{tema}-{numero}` |
| `titulo` | sim | Vira o nome do evento no Google Calendar |
| `descricao` | sim | Vira o campo de detalhes |
| `local` | sim | Vira o campo de local (ex: `"Online — Zoom"`) |
| `inicio` | sim | ISO 8601 **com timezone** |
| `fim` | sim | ISO 8601 **com timezone** |
| `ativo` | não | `false` desabilita o botão. Ausente = ativo |

```json
{
  "id": "aula-sql-01",
  "titulo": "Modelagem de dados relacional",
  "descricao": "Chaves, normalização e índices na prática.",
  "local": "Online — Zoom",
  "inicio": "2026-09-01T19:00:00-03:00",
  "fim": "2026-09-01T20:30:00-03:00"
}
```

### Por que timezone explícito no ISO

Sem o offset, `new Date("2026-09-01T19:00:00")` é lido como hora **local do navegador**. Um aluno em
Lisboa criaria o evento às 19h de Lisboa — quatro horas antes da aula real. Com `-03:00`, a string
representa um instante absoluto, e o Google exibe o horário correto no fuso de cada pessoa.

### Por que o campo `ativo` em vez de apagar a aula

Apagar o registro perde histórico e rastreabilidade: não se sabe mais que aquela aula existiu, nem
com que dados. Com `"ativo": false`, o botão fica desabilitado e o card continua na página como
registro da turma.

### Convenção do `id`

`aula-{tema}-{numero}` — ex: `aula-sql-01`, `aula-python-02`.

Ids genéricos (`aula-1`, `evento-a`) ficam ambíguos conforme a lista cresce, e o risco de repetir
sem perceber aumenta. Id repetido é falha silenciosa: `.find()` sempre devolve o primeiro, então a
segunda aula fica inalcançável. O `validarIdsDeAulas()` avisa quando isso acontece.

## Funções do `calendar.js`

Expostas em `window.Agenda` — dá para chamar no console do DevTools para inspecionar.

| Função | O que faz |
|---|---|
| `formatDateForGoogle(iso)` | ISO 8601 → `AAAAMMDDTHHMMSSZ` (UTC) |
| `gerarLinkGoogleCalendar(evento)` | Objeto de evento → URL pronta |
| `carregarAulas()` | `fetch` do JSON, com erro específico por modo de falha |
| `validarIdsDeAulas(aulas)` | Confere os `data-aula-id` do DOM contra o JSON |
| `inicializarBotoes(aulas)` | Liga o clique de cada botão |
| `inicializar()` | Ponto de entrada: orquestra as anteriores |

### Genérico x específico

`formatDateForGoogle` e `gerarLinkGoogleCalendar` falam de **evento**
(`{ titulo, descricao, local, inicio, fim }`) e não sabem o que é uma aula. Dá para reaproveitá-las
em webinars, lives e eventos institucionais sem alteração. Só as funções de borda — `carregarAulas`,
`validarIdsDeAulas`, `inicializarBotoes` — conhecem o conceito de "aula".

### Por que validar no load e não só no clique

Um `data-aula-id` digitado errado (típico de copiar um card e esquecer de trocar o id) só apareceria
quando alguém clicasse naquele botão específico. Numa página com dez aulas, o defeito passa pela
revisão e chega em produção. Validando no carregamento, o problema aparece na primeira vez que a
página é aberta.

O contorno vermelho de erro aparece **só em desenvolvimento** (`localhost`, `127.0.0.1` ou
`file://`) — em produção seria ruído para o aluno.

## Mensagens de erro

Nenhuma falha é silenciosa. Cada modo de falha tem mensagem própria, com o id ou motivo envolvido:

| Situação | Onde aparece |
|---|---|
| `data-aula-id` não existe no JSON | `console.warn` no load, nomeando o id e listando os válidos |
| `data-aula-id` ausente no botão | `console.warn` no load, com o elemento |
| Ids repetidos no JSON | `console.warn` no load |
| JSON malformado | `console.error` com a causa provável |
| Arquivo não encontrado (404) | `console.error` com o status HTTP |
| Bloqueio de `file://` | `console.error` com o comando do servidor |
| Clique em id inexistente | `console.error`, e a página segue funcionando |
| `fim` anterior ao `inicio` | `console.error` ao montar o link |
| Data sem timezone | `console.warn` explicando o risco |
| Aula encerrada ainda `ativo` | `console.info` em dev, sugerindo `"ativo": false` |

Quando o JSON não carrega, todos os botões são desabilitados e um aviso aparece na página — botão que
não faz nada ao clicar é pior do que botão visivelmente indisponível.

## Relação com a landing page em React

Esta pasta é **independente** da aplicação React na raiz do repositório: é HTML/JS puro, não entra no
build do Vite e não é publicada em `docs/`.

Para levar a feature à landing page, o equivalente seria uma função que recebe um `Session` de
`src/data/event.ts` e devolve a URL — a lógica de `gerarLinkGoogleCalendar` se aproveita quase
inteira. A diferença é que lá os dados já estão importados em tempo de build, então não há `fetch`,
não há `data-aula-id` e a validação de id deixa de ser necessária: o TypeScript garante isso.
