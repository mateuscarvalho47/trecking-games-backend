# Ludex — Design Brief para Claude Design

## O que é o projeto

**Ludex** é um rastreador pessoal de jogos. O usuário autentica, busca jogos pelo nome (integração com IGDB — base de dados global de jogos), adiciona à sua biblioteca com um status, e acompanha progresso, notas, horas jogadas e avaliações.

Pense em algo como Letterboxd, mas para jogos.

---

## Paleta / Identidade visual desejada

- Tema escuro (dark-first)
- Sensação de gaming sem ser excessivamente "gamer" — clean, moderno, sóbrio
- Tipografia legível, hierarquia clara
- Cores de acento vibrantes mas contidas (ex.: roxo, azul elétrico, ou verde neon — escolha uma)
- Covers de jogos são imagens coloridas — o layout precisa funcionar bem com miniaturas ricas

---

## Stack frontend (para referência técnica)

- React 19 + TypeScript
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- Tailwind CSS 4
- shadcn/ui (class-variance-authority + tailwind-merge)

---

## Dados disponíveis na API

### Usuário
```
{ id, email }
```

### Jogo (resultado de busca IGDB)
```
{ igdbId, name, coverUrl?, releaseYear?, platforms[], genres[] }
```

### Entrada de biblioteca
```
{
  igdbId, name, coverUrl?,
  genres[], platforms[],
  status: WISHLIST | BACKLOG | PLAYING | PAUSED | COMPLETED | DROPPED,
  userPlatform?,   // plataforma que o usuário joga
  rating?,         // 0–10
  hoursPlayed?,    // número decimal
  notes?,          // texto livre
  completedAt?,
  createdAt, updatedAt
}
```

### Estatísticas da biblioteca
```
{
  totalGames,
  totalHours,
  countByStatus: { WISHLIST: n, BACKLOG: n, PLAYING: n, ... },
  topGenres:    [{ genre, count }],
  topPlatforms: [{ platform, count }],
  ratingDistribution: [{ rating, count }],
  completedTimeline:  [{ month, count }]   // ex: "2025-03"
}
```

---

## Páginas necessárias

### 1. Login / Registro
**Rota:** `/login`, `/register`

Formulário simples. Campos: email + senha. Link entre as duas páginas.
O app não tem recuperação de senha por ora — não precisa do link.

Layout sugerido: centralizado, fundo escuro com algum elemento visual de jogos (pode ser abstrato/geométrico).

---

### 2. Dashboard / Home (`/`)

Página principal após login. Visão geral da biblioteca.

**Conteúdo:**
- Cards de resumo rápido: total de jogos, horas totais, jogos completados, jogos em andamento
- Lista curta "Jogando agora" (status = PLAYING) com cover + nome + plataforma
- Lista curta "Próximos na fila" (status = BACKLOG, 3–5 jogos)
- Botão/atalho proeminente para buscar e adicionar jogo

---

### 3. Biblioteca (`/library`)

Lista completa dos jogos do usuário.

**Conteúdo:**
- Filtro por status (tabs ou pills): Todos | Wishlist | Backlog | Jogando | Pausado | Completo | Abandonado
- Cada item: cover (thumbnail), nome, plataforma escolhida pelo usuário, avaliação (0–10 estrelas ou número), status badge, horas jogadas
- Ordenação: por nome, data de adição, avaliação, horas
- Dois modos de visualização: grid de cards (cover grande) e lista compacta

---

### 4. Busca de jogos (`/search` ou modal global)

Pode ser uma rota dedicada ou um modal ativado por atalho/botão.

**Fluxo:**
1. Campo de busca — digita nome do jogo
2. Resultado em tempo real (debounce): cover, nome, ano de lançamento, plataformas
3. Clicar num resultado abre o modal "Adicionar à biblioteca"

**Modal "Adicionar à biblioteca":**
- Cover grande + nome + plataformas disponíveis (vindo do IGDB)
- Select: status
- Select: plataforma do usuário (texto livre ou select)
- Botão confirmar

---

### 5. Detalhe / Edição de entrada (`/library/:igdbId`)

Página completa de uma entrada na biblioteca.

**Conteúdo:**
- Header: cover (grande), nome, plataformas IGDB, gêneros, ano
- Seção editável inline ou via form:
  - Status (select com as 6 opções)
  - Plataforma que o usuário joga (input texto)
  - Avaliação (0–10 — pode ser slider ou estrelas)
  - Horas jogadas (input numérico)
  - Notas (textarea)
  - Data de conclusão (date picker — aparece quando status = COMPLETED)
- Botão "Remover da biblioteca" (destrutivo, pede confirmação)

---

### 6. Estatísticas (`/stats`)

Página de insights da biblioteca do usuário.

**Conteúdo:**
- Números grandes: total de jogos, total de horas, jogos completados
- Distribuição por status (donut chart ou barras)
- Top gêneros (barras horizontais)
- Top plataformas (barras horizontais)
- Distribuição de avaliações (histograma 0–10)
- Timeline de conclusões (gráfico de linha ou barras por mês)

---

## Navegação

Layout com sidebar fixa (desktop) / bottom nav (mobile):

| Item | Rota |
|---|---|
| Home | `/` |
| Biblioteca | `/library` |
| Buscar | `/search` ou modal |
| Estatísticas | `/stats` |
| Avatar/email + Logout | — |

---

## Estados importantes a considerar

- **Lista vazia**: biblioteca vazia — call to action para buscar o primeiro jogo
- **Loading**: skeletons nas listas e cards (não spinners genéricos)
- **Erro de autenticação**: redirect para `/login`
- **Cover ausente**: placeholder genérico de jogo (não quebrar layout)
- **Avaliação nula**: mostrar "—" ou cinza, não zero

---

## O que NÃO existe (não desenhar)

- Feed social / amigos / atividade pública
- Listas customizadas além dos status padrão
- Importação de dados
- Notificações
- Perfil público
