# CLAUDE.md — BI Web Pátria

Briefing para o Claude Code. Fonte de verdade: [docs/PRD.md](docs/PRD.md). Em caso de conflito, o PRD vence; em caso de lacuna, **pergunte — não invente**.

## Projeto

Aplicação web **interna** da Pátria Consolidadora que substitui os relatórios Power BI `AEREO_PATRIA`, `TERRESTRE_PATRIA` e `OPERADORA PÁTRIA` (custo de licenciamento por usuário). Objetivo: máxima fidelidade visual e de números ao Power BI atual, com gestão de usuários/permissões e dados migrados para o Supabase.

- V1 **não** é SaaS multiempresa. Público: equipe autorizada da Pátria.
- Módulos: Aéreo, Terrestre, Operadora (depende de Grupos e cadastros auxiliares).
- Entrega incremental: fundações + homologação do Aéreo → Terrestre → Operadora/Grupos. Conciliar com o Power BI antes de substituí-lo.
- Fora do escopo: reescrever RPAs, assumir API do Wooffice, cobrança/Stripe, multiempresa, chat, Kanban, landing page, agenda.

## Stack

- Next.js (App Router) + React + TypeScript (strict) — hospedado na **Vercel**
- Tailwind CSS + shadcn/ui
- Supabase: Postgres, Auth, RLS
- Importador **Python** na VPS existente (reaproveita CSV/Excel dos RPAs atuais)
- Claude Code como ferramenta de desenvolvimento

Fixar versões compatíveis ao iniciar. **Não adicionar** Prisma, Stripe, tRPC ou provedor de e-mail sem aprovação. Biblioteca de gráficos/matrizes: decidir só após protótipo de fidelidade (hierarquias, subtotais, matrizes).

### Versões fixadas (`apps/web`)

| Pacote | Versão |
| --- | --- |
| Node.js | `22.18.0` (ver `apps/web/.nvmrc`) |
| Next.js | `16.4.6` |
| React / react-dom | `19.3.0` |
| TypeScript | `5.9.3` |
| Tailwind CSS | `4.3.3` |
| shadcn (CLI) | `4.23.0` |
| ESLint | `9.39.5` |
| Prettier | `3.10.1` |
| Vitest | `5.1.0` |
| @testing-library/react | `16.3.3` |
| @playwright/test | `1.65.1` |
| Zod | `4.6.7` |

Todas as dependências de `apps/web` estão fixadas (sem `^`/`~`) em `apps/web/package.json`. Ao atualizar, fixar a nova versão exata e rodar `lint`, `typecheck`, `test` e `build` antes de commitar.

### Comandos (executar em `apps/web`)

```bash
npm install          # instalar dependências
npm run dev           # servidor de desenvolvimento
npm run build         # build de produção
npm run start         # servir o build de produção
npm run lint          # ESLint
npm run format        # Prettier (escreve)
npm run format:check  # Prettier (somente verifica)
npm run typecheck     # tsc --noEmit
npm run test          # testes unitários/componentes (Vitest)
npm run test:watch    # Vitest em modo watch
npm run test:e2e      # Playwright (requer `npx playwright install chromium` na primeira vez)
```

CI (GitHub Actions, `.github/workflows/ci.yml`) roda lint, typecheck, format:check, test, build e test:e2e em todo push/PR para `main`.

## Estrutura de pastas

A raiz `E:\Pátria\Novo BI` contém os originais do Power BI e materiais de inspeção. Estrutura proposta para o código novo (confirmar antes de criar):

```
AEREO_PATRIA/ TERRESTRE_PATRIA/ OPERADORA PÁTRIA/   # ORIGINAIS — somente leitura
docs/            # PRD.md e documentação
apps/web/        # Next.js (App Router)
  src/app/       #   rotas por módulo: aereo, terrestre, operadora, admin
  src/components/#   ui/ (shadcn), charts/, filters/, layout/
  src/lib/       #   supabase clients, permissões, formatação, regras de negócio
supabase/        # migrations SQL, políticas RLS, seeds
importer/        # Python: leitura, validação, staging, publicação transacional
```

## Regras críticas de dados

- **Sem upsert por linha.** `vendaid`, `Venda`, bilhete e `chave_unicidade` **não** são chaves de negócio confiáveis.
- Unidade de substituição = **fonte + mês/período declarado**. Fluxo: carregar retrato completo em área intermediária → validar (arquivo, esquema, período, contagens, regras) → publicar **em uma transação**, substituindo só aquele recorte e preservando os demais meses.
- Carga inválida/incompleta **nunca** substitui a base publicada; manter a última carga válida e exibir sua data. Repetir a mesma carga não pode duplicar resultados.
- Auditoria por execução: origem, hash, período, versão das regras, início/fim, linhas lidas/publicadas/rejeitadas, resultado. Guardar cópia versionada dos arquivos. Sem segredos nem dados pessoais em logs.
- Contrato de esquema **por fonte**; não presumir igualdade entre Aéreo, Terrestre e Operadora.
- **Paridade de regras** (Python, Power Query, DAX): mesmo tratamento de nulos, divisão por zero, contagem distinta, filtros e datas. Não unificar fórmulas só por terem o mesmo nome (Aéreo/Terrestre: `rentabilidade_003`/`tarifa_003`; Operadora: `Total`/`TotalRecebimento`). Não somar domínios sem homologar escopos.
- Divergências já conhecidas (gráfico Cabines intitulado "Bilhetes" usando XR Vendas; origem divergente no Terrestre; classificação diferente em Operadora/Grupos): **não corrigir nem copiar** sem decisão registrada.
- Fontes e caminhos (`M:\scripts\patria`, `\\10.10.10.1\m2s\scripts\patria`) são **privados**. A Vercel não acessa o compartilhamento; a importação roda na VPS. Detalhes em PRD, seção "Fontes de dados".

## Segurança e autorização

- Autorização **no servidor/banco** (RLS), nunca só na UI. Ocultar componente não protege consulta nem exportação.
- Negar por padrão; acesso sem regra explícita é negado. Rentabilidade e exportação têm permissões próprias.
- Sem cadastro público: convite/ativação, desativação e gestão de perfis por administrador.
- Segredos só no servidor. A chave `service_role` e credenciais da VPS **nunca** vão ao navegador, ao repositório ou ao PRD.
- Carteira/escopo vem de regra cadastral homologada — **não** inferir de `MAX(promotor_003)` nem do nome exibido.
- Matriz de perfis ainda não homologada: perfis do PRD são propostas.
- Atualização manual é assíncrona: a Vercel não fica aguardando o RPA; a VPS processa e a app acompanha o estado.

## Convenções de código

- TypeScript strict, sem `any` injustificado. Validar entradas externas (ex.: Zod).
- Server Components por padrão; Client Components só para interação. Acesso a dados sensíveis em servidor.
- Identificadores de código em inglês `snake_case` no banco (minúsculo) e `camelCase`/`PascalCase` no TS; textos de interface e mensagens em **pt-BR**.
- Migrations SQL versionadas em `supabase/`; toda tabela exposta tem RLS habilitada. Seguir a skill `supabase-postgres-best-practices` (índices, tipos, RLS, transações curtas).
- Formatos pt-BR: moeda BRL, datas `dd/MM/yyyy`, separadores decimais iguais aos do Power BI.
- Todo componente de dados trata estados: carregando, erro, sem resultado, dados indisponíveis. Filtros com "limpar filtros". Calendário é filtro, não módulo de agenda.
- Acessibilidade: teclado, rótulos, contraste; prioridade desktop, responsivo; tabelas largas com rolagem controlada.
- Fidelidade só se comprova com **referência renderizada**; JSON do Power BI sozinho não basta.
- Não modificar os relatórios/fontes originais sem autorização específica.
- Commits pequenos, um marco entregável por vez; testar cada marco antes do próximo.

## Identidade visual

Referência principal: o Power BI atual. Preservar identidade, distribuição dos indicadores, títulos, formatos, filtros, navegação, matrizes e interações. Evoluções de UX devem manter familiaridade e ser registradas.

| Uso | Valor |
| --- | --- |
| Roxo (primária) | `#5208A5` |
| Fundo rosado | `#FFE4E2` |
| Vermelho | `#C82727` / `#F20013` |
| Laranja | `#F87F07` |
| Fonte | Verdana (predominante) |

- Capa vermelha com logotipo Pátria (texto da imagem cita 2025 — confirmar atualização).
- Canvas das páginas: **1920 × 800**; xray: **1600 × 4700** com rolagem vertical.
- Navegação por barra de ícones; filtros, cartões, gráficos e matrizes como no original.
- Usar recursos originais autorizados em `.Report\StaticResources` (imagens/tema).

## Páginas por módulo

- Comuns: Capa, Auditoria de dados, Vendas, Agências, Executivos, Metas, Share diário.
- Aéreo: + Cias, Cias Frontur, Agências inativas, xray.
- Terrestre: + Produtos, Agências inativas.
- Operadora: + Produtos, Produtos X Grupos.
- Inventário: 30 páginas / 830 objetos (inclui decoração e ocultas). Aprovar escopo **por página**; não virar rota toda página oculta/duplicada. Preservar referências, sem descarte silencioso.
- xray: faixas ADVP 0–13, 14–20, 21–27, 28–59, 60+ dias (+ estados sem data/inconsistente); compra urgente 0–1 dia; gráficos mensais com filtro de data desabilitado devem permanecer independentes.

## Referências

- Notion (via MCP, configurado em `.vscode/mcp.json`): [BI Web Pátria](https://app.notion.com/p/41a457f870428192af10c35f65c0db3d), [Diagnóstico](https://app.notion.com/p/41a457f870428159ba2ccd127ef44a72), [Aéreo](https://app.notion.com/p/41a457f8704281bda5a9f96125103ed1), [Terrestre](https://app.notion.com/p/41a457f8704281edb77bc2b32ff71e50), [Operadora](https://app.notion.com/p/41a457f8704281058474da02b0f6a76c), [Fontes e geradores](https://app.notion.com/p/41a457f8704281328081da9819d49799).
- Modelos locais (DAX, Power Query, relações): `AEREO_PATRIA\AEREO_PATRIA.SemanticModel\definition`, `TERRESTRE_PATRIA\TERRESTRE_PATRIA.SemanticModel\definition`, `OPERADORA PÁTRIA\OPERADORA_PATRIA.SemanticModel\definition`.
- Páginas/visuais: `*.Report\definition`.
- Inspeção completa: `C:\Users\MAURICIO SANTOS\Documents\Codex\2026-11-16\referenced-chatgpt-conversation-this-is-an\outputs` (`analise_dos_relatorios.md`, `inventario_power_bi.json`, `medidas_dax.md`, `mapa_dos_layouts.html`, `mapeamento_fontes_e_geradores.md`). O mapa HTML é reconstrução de posições, não captura real.
- Docs técnicas: Next.js, React, TypeScript, Tailwind, shadcn/ui, Supabase (Auth, RLS, conexão Postgres), PostgreSQL (transações), Vercel — links no PRD, seção 5.

## Pendências (não assumir)

Matriz de perfis/carteiras; horários/SLA de carga; retenção; responsáveis pelo 518 e cadastros; páginas legadas em uso; conciliação; orçamento e usuários simultâneos; URL do projeto Supabase e domínio Vercel; links do Power BI Service; agendador atual (n8n?) e variante de RPA ativa. **Nunca inventar** URLs, chaves ou credenciais.
