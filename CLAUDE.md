# Tennis App 1 — CLAUDE.md

> Guia de projeto para o Claude Code. Leia este arquivo antes de qualquer tarefa.

---

## Visão Geral do Projeto

**Tennis App 1** é um aplicativo mobile/web para gerenciamento e acompanhamento de treinos, partidas e evolução de jogadores de tênis. O objetivo central é dar ao jogador (e ao técnico) um painel claro do desempenho ao longo do tempo.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React Native (iOS + Android) ou Next.js (web) |
| Backend | Node.js + Express ou Supabase (BaaS) |
| Banco de dados | PostgreSQL (via Supabase) |
| Autenticação | Supabase Auth (email/senha + Google OAuth) |
| Storage (mídia) | Supabase Storage |
| Notificações | Slack Webhook (alertas internos de dev) / Push via Expo Notifications |
| Hospedagem | Vercel (frontend) + Supabase (backend/DB) |
| CI/CD | GitHub Actions |

> **Decisão pendente:** confirmar se o frontend será React Native (mobile-first) ou Next.js (web-first) antes de criar os primeiros componentes.

---

## Funcionalidades Planejadas

### MVP (Fase 1)
- [ ] Cadastro e login de jogador
- [ ] Registro de partida: data, placar, adversário, local
- [ ] Registro de treino: data, duração, tipo (técnico / tático / físico), observações
- [ ] Dashboard com estatísticas básicas: vitórias/derrotas, horas treinadas, ranking pessoal
- [ ] Perfil do jogador (nível, categoria, clube)

### Fase 2
- [ ] Gráficos de evolução (win rate, pontos de ranking ao longo do tempo)
- [ ] Sistema de metas semanais/mensais
- [ ] Upload de vídeo de jogadas (Supabase Storage)
- [ ] Notificações de lembretes de treino (push)

### Fase 3 — IA
- [ ] Análise de padrões de jogo via Claude API
- [ ] Sugestões de treino personalizadas com base no histórico
- [ ] Chat com assistente de tênis (powered by Claude claude-sonnet-4-6)

---

## Arquitetura de Pastas (Target)

```
tenis-app-1/
├── CLAUDE.md               ← este arquivo
├── apps/
│   ├── web/                ← Next.js ou React Native Web
│   └── mobile/             ← React Native (Expo)
├── packages/
│   ├── ui/                 ← componentes compartilhados
│   ├── db/                 ← schema Prisma ou Supabase types
│   └── api/                ← client de chamadas ao backend
├── supabase/
│   ├── migrations/         ← SQL migrations
│   └── seed.sql
├── .github/
│   └── workflows/
│       └── ci.yml
└── package.json            ← monorepo root (pnpm workspaces)
```

---

## Banco de Dados — Schema Inicial

```sql
-- Jogadores
create table players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  level text check (level in ('iniciante','intermediário','avançado','profissional')),
  club text,
  created_at timestamptz default now()
);

-- Partidas
create table matches (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players not null,
  opponent_name text not null,
  date date not null,
  score text not null,          -- ex: "6-4, 3-6, 7-5"
  result text check (result in ('vitória','derrota','WO')),
  location text,
  notes text,
  created_at timestamptz default now()
);

-- Treinos
create table trainings (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players not null,
  date date not null,
  duration_minutes int not null,
  type text check (type in ('técnico','tático','físico','jogo')),
  notes text,
  created_at timestamptz default now()
);
```

---

## Convenções de Código

- **Língua do código:** inglês (variáveis, funções, comentários)
- **Língua da UI:** português (Brasil)
- **Commits:** mensagens em inglês, formato Conventional Commits (`feat:`, `fix:`, `chore:`)
- **Formatação:** Prettier + ESLint; sem comentários desnecessários
- **Testes:** Vitest (unitários) + Playwright (E2E); rodar antes de qualquer PR
- **Segurança:** nunca expor chaves de API no código; usar `.env.local` sempre

---

## Comandos Essenciais

```bash
# Instalar dependências
pnpm install

# Rodar dev (web)
pnpm dev

# Rodar testes
pnpm test

# Build de produção
pnpm build

# Migrations Supabase
supabase db push

# Gerar tipos do banco
supabase gen types typescript --local > packages/db/types.ts
```

---

## Integração Slack (Notificações de Dev)

Para alertas internos (erros de CI, deploys, etc.) configurar um Incoming Webhook no Slack:

```env
# .env.local
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
```

Usar no código:

```ts
// packages/api/slack.ts
export async function notifySlack(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({ text: message }),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## Integração Claude API (Fase 3)

```ts
// Modelo padrão do projeto
const MODEL = 'claude-sonnet-4-6';

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function getTennisInsight(playerStats: string) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analise as estatísticas deste jogador de tênis e sugira 3 pontos de melhoria:\n\n${playerStats}`,
      },
    ],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}
```

---

## Regras para o Claude Code

1. **Nunca criar arquivos de documentação** extras além deste CLAUDE.md — use comentários no código.
2. **Sempre rodar `pnpm test`** antes de reportar uma tarefa como concluída.
3. **Row-Level Security (RLS)** deve estar ativada em todas as tabelas do Supabase.
4. **Não adicionar dependências** sem checar se já existe algo na stdlib ou no projeto.
5. Para mudanças no schema do banco, **sempre criar uma migration** em `supabase/migrations/`.
6. O branch de desenvolvimento principal é `claude/tennis-app-cloud-md-oTLan` — nunca fazer push direto para `main`.

---

## Próximos Passos (Para Fazer no Computador)

- [ ] Instalar dependências: Node.js 20+, pnpm, Supabase CLI, Expo CLI
- [ ] Criar projeto no Supabase Dashboard
- [ ] Configurar variáveis de ambiente em `.env.local`
- [ ] Scaffoldar o frontend com `npx create-next-app` ou `npx create-expo-app`
- [ ] Implementar autenticação (Supabase Auth)
- [ ] Criar as primeiras migrations do banco
- [ ] Implementar tela de registro de partida (MVP)

---

*Criado em 2026-05-31 · Branch: `claude/tennis-app-cloud-md-oTLan`*
