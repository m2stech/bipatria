# PLAN — Plano de execução do BI Web Pátria

Baseado em [PRD.md](./PRD.md) e [CLAUDE.md](../CLAUDE.md). Ordem: **setup → interface (com dados simulados) → backend → integração → deploy**.

## Regras de execução

- Cada milestone é um incremento entregável e testado antes de seguir. Não iniciar o próximo com o anterior incompleto.
- Uma branch por milestone, criada a partir de `main`; merge em `main` por PR após o commit final. Sugestão: squash para manter o histórico limpo.
- Commits no padrão Conventional Commits. O "commit final" é a mensagem do último commit/squash da milestone.
- Originais do Power BI (`AEREO_PATRIA`, `TERRESTRE_PATRIA`, `OPERADORA PÁTRIA`) são somente leitura e **não entram no repositório**.
- Nenhuma credencial, chave ou dado pessoal em código, commits ou logs. Não inventar URLs do Supabase/Vercel.
- Fidelidade visual é validada com referências renderizadas do Power BI, não só com JSON.
- Itens marcados **[DECISÃO]** dependem de homologação do cliente (ver pendências do PRD). Se ainda estiverem em aberto, registrar a premissa adotada e seguir com configuração fácil de mudar.

## Visão geral

| # | Milestone | Branch | Fase |
| --- | --- | --- | --- |
| M0 | Setup do projeto e repositório | `milestone/m00-setup` | Setup |
| M1 | Design system e shell da aplicação | `milestone/m01-design-system` | Interface |
| M2 | Protótipo de fidelidade de gráficos e matrizes | `milestone/m02-chart-prototype` | Interface |
| M3 | Camada de dados simulados e filtros | `milestone/m03-mock-data-filters` | Interface |
| M4 | Módulo Aéreo (páginas, exceto xray) | `milestone/m04-aereo-ui` | Interface |
| M5 | xray do Aéreo | `milestone/m05-xray-ui` | Interface |
| M6 | Módulo Terrestre | `milestone/m06-terrestre-ui` | Interface |
| M7 | Módulo Operadora e Grupos | `milestone/m07-operadora-ui` | Interface |
| M8 | Supabase: schema, staging e publicação | `milestone/m08-supabase-schema` | Backend |
| M9 | Autenticação, perfis, RLS e administração de usuários | `milestone/m09-auth-rls` | Backend |
| M10 | Importador Python na VPS | `milestone/m10-importer` | Backend |
| M11 | Integração da UI com dados reais e paridade | `milestone/m11-real-data-parity` | Integração |
| M12 | Auditoria, atualização manual e exportação | `milestone/m12-ops-export` | Integração |
| M13 | Qualidade, acessibilidade e homologação | `milestone/m13-qa-homologation` | Deploy |
| M14 | Deploy, operação paralela e entrada em produção | `milestone/m14-deploy` | Deploy |

---

## M0 — Setup do projeto e repositório

**Branch:** `milestone/m00-setup`
**Objetivo:** base técnica reproduzível, com repositório, tooling e CI mínimos.

- [x] Inicializar Git (a pasta ainda não é repositório) com branch `main`
- [x] `.gitignore` excluindo originais do Power BI, `outputs/`, `work/`, `.env*`, `node_modules`, `.next`, dados e arquivos de carga
- [x] Criar `apps/web` com Next.js (App Router) + React + TypeScript strict; fixar versões
- [x] Configurar Tailwind CSS e shadcn/ui
- [x] ESLint, Prettier, `tsc --noEmit` e scripts `lint`, `typecheck`, `test`, `build`
- [x] Configurar framework de testes (unitário e componentes) e Playwright para E2E/visual
- [x] `.env.example` sem valores reais; validação de variáveis de ambiente
- [x] Pipeline de CI (lint, typecheck, test, build) no provedor Git escolhido
- [x] Criar esqueleto `supabase/` e `importer/` (somente README com propósito)
- [x] Atualizar `CLAUDE.md` com comandos reais e versões fixadas

**Commit final:** `chore: setup inicial do monorepo (Next.js, Tailwind, shadcn/ui, CI)`

---

## M1 — Design system e shell da aplicação

**Branch:** `milestone/m01-design-system`
**Objetivo:** identidade visual da Pátria aplicada e navegação funcional entre módulos, sem dados.

- [x] Tokens de tema: roxo `#5208A5`, fundo `#FFE4E2`, vermelhos `#C82727`/`#F20013`, laranja `#F87F07`, Verdana
- [x] Extrair e versionar os recursos visuais autorizados (logotipo, ícones, imagens de `.Report\StaticResources`) — copiados para `apps/web/public/brand`; originais intactos
- [x] Layout base: barra de navegação por ícones, cabeçalho e área de canvas
- [x] Contêiner de página com canvas 1920 × 800 e variante 1600 × 4700 com rolagem vertical (xray)
- [x] Rotas vazias por módulo e página (Aéreo, Terrestre, Operadora, Admin) conforme o inventário aprovado — `Duplicata de Executivos` e páginas ocultas ficam sem rota até decisão
- [x] Capa vermelha com logotipo **[DECISÃO]** texto "2025" a atualizar — premissa: usar a imagem original sem alteração até confirmação do cliente
- [x] Componentes de estado: carregando, erro, sem resultado, dados indisponíveis
- [x] Componentes base: cartão de indicador, container de visual, botão limpar filtros
- [x] Responsividade: menus e filtros adaptados ao celular, rolagem controlada de tabelas largas
- [x] Rotas de login/admin como placeholders (sem autenticação real)
- [x] Testes de componentes e captura visual de referência do shell (anexo `shell-aereo-vendas.png` no relatório do Playwright)

**Commit final:** `feat(ui): design system Pátria e shell de navegação por módulos`

---

## M2 — Protótipo de fidelidade de gráficos e matrizes

**Branch:** `milestone/m02-chart-prototype`
**Objetivo:** decidir a biblioteca de visuais com base em evidência, antes de construir as páginas.

- [x] Levantar dos inventários os tipos de visual e recursos necessários (barras, colunas, linhas, roscas, cartões, tabelas/matrizes, hierarquias, subtotais, ordenação) — tabela completa por tipo/módulo em `docs/adr/0001-biblioteca-de-visuais.md`, extraída de `inventario_power_bi.json`
- [x] Prototipar ao menos 2 candidatas para gráficos e 2 para matrizes/tabelas com hierarquia e subtotais — Recharts vs ECharts; TanStack Table vs Material React Table (AG Grid descartado antes por exigir licença Enterprise para pivot avançado — decisão do cliente)
- [x] Comparar com referências renderizadas do Power BI (capturas) em páginas representativas — capturas reais do cliente (`PRINTS_BI_AEREO/`, fora do git por conter dados reais de negócio) comparadas com os protótipos nas páginas Vendas, Cias e X-ray; achados (ícone `⊞`/`⊟`, coluna de %, total fixo no rodapé, barras em gradiente por ranking, linha multi-série, ícone central na rosca) documentados em `docs/adr/0001-biblioteca-de-visuais.md` — nenhum muda a escolha de biblioteca, todos ficam como ajuste de wrapper para o M4
- [x] Avaliar desempenho com volume realista, acessibilidade e tamanho do bundle — maior chunk caiu de 2,4 MB (com as 4 libs) para 456 KB após a decisão; acessibilidade e limitações registradas no ADR
- [x] Registrar a decisão (ADR) em `docs/adr/` com critérios, resultado e riscos — `docs/adr/0001-biblioteca-de-visuais.md`
- [x] Implementar wrappers próprios de gráfico/matriz isolando a biblioteca escolhida — `apps/web/src/components/charts/` (Recharts) e `apps/web/src/components/matrix/` (TanStack Table); candidatas descartadas removidas do pacote
- [x] Testes dos wrappers (formato, nulos, divisão por zero, ordenação, subtotais) — `aggregations.test.ts`, `tanstack-sales-matrix.test.tsx`, `charts.test.tsx`

**Commit final:** `feat(charts): protótipo de fidelidade e ADR da biblioteca de visuais`

---

## M3 — Camada de dados simulados e filtros

**Branch:** `milestone/m03-mock-data-filters`
**Objetivo:** contrato de dados tipado e filtros reutilizáveis que depois trocam mock por Supabase sem refazer a UI.

- [x] Definir tipos TypeScript dos domínios a partir dos modelos semânticos: `f_Vendas` (Aéreo/Terrestre), `f_Operadora`, `f_Grupos` e dimensões — `apps/web/src/lib/domain/` (tipos de Aéreo e Terrestre mantidos independentes mesmo com nomes de coluna iguais, pois os papéis semânticos divergem — ver comentários no código)
- [x] Interface de repositório de dados (`DataSource`) com implementação mock; UI depende só da interface — `apps/web/src/lib/data/data-source.ts` e `apps/web/src/lib/data/mock/mock-data-source.ts`
- [x] Gerar fixtures sintéticas determinísticas (sem dados reais de clientes), incluindo casos de borda: nulos, zero, datas inconsistentes — `apps/web/src/lib/data/mock/fixtures-*.ts`, PRNG seedado (`prng.ts`)
- [x] Portar regras de cálculo para funções puras testadas: nulos, divisão por zero, contagem distinta, janelas de data, faixas ADVP — `apps/web/src/lib/rules/`
- [x] Registrar quais medidas DAX foram portadas e quais ficam pendentes; **não unificar fórmulas por nome** (`rentabilidade_003`/`tarifa_003` vs `Total`/`TotalRecebimento`) — `docs/paridade-dax.md`
- [x] Estado global de filtros (URL como fonte de verdade): emissão, agência, executivo/promotor, rede, mentoria, companhia, filial, nacional/internacional, origem/destino, sistema, produto, fornecedor, cabine — `apps/web/src/lib/filters/` (useSearchParams/useRouter nativos do Next, sem nova dependência)
- [x] Filtro de calendário (componente visual) e "limpar filtros" — `apps/web/src/components/visuals/date-range-filter.tsx` (shadcn `Calendar`/`Popover`, intervalo via `periodoInicio`/`periodoFim`); botão `ClearFiltersButton` (M1) já pronto
- [x] Testes unitários das regras e dos filtros — 92 testes (Vitest)

**Commit final:** `feat(data): contrato de dados, mocks determinísticos, regras portadas e filtros`

---

## M4 — Módulo Aéreo (páginas, exceto xray)

**Branch:** `milestone/m04-aereo-ui`
**Objetivo:** primeiro módulo completo na interface, servindo de molde para os demais.

- [ ] Aprovar o escopo por página a partir do inventário (12 páginas); registrar páginas ocultas/duplicadas **[DECISÃO]**
- [ ] Capa
- [ ] Auditoria de dados (estrutura pronta; dados virão no M12)
- [ ] Vendas
- [ ] Agências
- [ ] Executivos (decidir sobre a duplicata)
- [ ] Metas
- [ ] Share diário
- [ ] Cias
- [ ] Cias Frontur
- [ ] Agências inativas
- [ ] Filtros por página conforme o inventário e interações aprovadas
- [ ] Botões de ocultar/exibir valores apenas como recurso visual (não é autorização)
- [ ] Comparação visual com referências do Power BI; registrar divergências conhecidas sem corrigi-las
- [ ] Testes de componentes e E2E de navegação e filtros

**Commit final:** `feat(aereo): páginas do módulo Aéreo com dados simulados`

---

## M5 — xray do Aéreo

**Branch:** `milestone/m05-xray-ui`
**Objetivo:** página xray fiel, com regras próprias de data e faixas.

- [ ] Layout 1600 × 4700 com rolagem vertical
- [ ] Indicadores: desempenho, vendas, lucro/rentabilidade, bilhetes, ticket médio, recorrência, última compra, concentração
- [ ] Evolução mensal e sazonalidade; manter independentes os gráficos com filtro de data desabilitado
- [ ] Rotas, destinos e cabines
- [ ] Antecedência ADVP: faixas 0–13, 14–20, 21–27, 28–59 e 60+, estados sem data/data inconsistente, compra urgente 0–1 dia
- [ ] Registrar a divergência do gráfico Cabines/"Bilhetes" (XR Vendas) sem corrigir **[DECISÃO]**
- [ ] Testes das faixas e dos cálculos de recorrência/concentração
- [ ] Conferência visual com referência renderizada

**Commit final:** `feat(xray): página xray do Aéreo com faixas ADVP e gráficos independentes`

---

## M6 — Módulo Terrestre

**Branch:** `milestone/m06-terrestre-ui`
**Objetivo:** módulo Terrestre reaproveitando componentes do Aéreo, respeitando as diferenças de esquema.

- [ ] Aprovar escopo por página (9 páginas)
- [ ] Páginas comuns: Capa, Auditoria, Vendas, Agências, Executivos, Metas, Share diário
- [ ] Produtos
- [ ] Agências inativas
- [ ] Tratar diferenças de campos de origem entre Aéreo e Terrestre; registrar divergência **[DECISÃO]**
- [ ] Reaproveitar componentes sem copiar regras do Aéreo
- [ ] Testes de componentes e E2E

**Commit final:** `feat(terrestre): páginas do módulo Terrestre com dados simulados`

---

## M7 — Módulo Operadora e Grupos

**Branch:** `milestone/m07-operadora-ui`
**Objetivo:** módulo Operadora, incluindo dependência de Grupos e do dataset do Terrestre.

- [ ] Aprovar escopo por página (9 páginas)
- [ ] Páginas comuns: Capa, Auditoria, Vendas, Agências, Executivos, Metas, Share diário
- [ ] Produtos
- [ ] Produtos X Grupos
- [ ] Modelar a dependência com `f_Vendas`/dimensões do Terrestre e `f_Grupos`
- [ ] Usar `Total`/`TotalRecebimento` conforme regras da Operadora; não somar domínios sem homologar escopos
- [ ] Registrar divergência de classificação Operadora/Grupos sem corrigir **[DECISÃO]**
- [ ] Testes de componentes e E2E

**Commit final:** `feat(operadora): páginas de Operadora e Grupos com dados simulados`

---

## M8 — Supabase: schema, staging e publicação

**Branch:** `milestone/m08-supabase-schema`
**Objetivo:** banco que suporta retratos completos por fonte + período, com validação e auditoria. Requer o projeto Supabase criado pelo cliente.

- [ ] Receber a URL do projeto Supabase e criar ambientes (dev e produção); nada de credenciais no repositório
- [ ] Migrations versionadas em `supabase/migrations` seguindo a skill `supabase-postgres-best-practices` (tipos, chaves, índices, nomes minúsculos)
- [ ] Tabelas publicadas por domínio: vendas Aéreo, vendas Terrestre, operadora, grupos e dimensões/cadastros (clientes, metas, aeroportos, redes, 518, companhias)
- [ ] Sem chave única por linha de venda; coluna de recorte (`fonte` + `periodo`) e referência à execução
- [ ] Área intermediária (staging) por execução
- [ ] Tabelas de auditoria: execuções, arquivos (origem, hash, período, versão das regras), contagens lidas/publicadas/rejeitadas, validações, falhas
- [ ] Mapa de cobertura de histórico por fonte
- [ ] Função de publicação transacional: valida staging e substitui somente o recorte fonte+mês, preservando os demais
- [ ] Trava por fonte/período para impedir execuções concorrentes
- [ ] Views/funções de leitura que reproduzam os indicadores e a "última carga válida"
- [ ] Testes SQL: repetir carga não duplica; carga parcial não apaga o período; falha mantém a base anterior; registro removido do novo retrato some do recorte
- [ ] Índices para os filtros principais, validados com `EXPLAIN ANALYZE`

**Commit final:** `feat(db): schema, staging e publicação transacional por fonte e período`

---

## M9 — Autenticação, perfis, RLS e administração de usuários

**Branch:** `milestone/m09-auth-rls`
**Objetivo:** acesso restrito, com autorização no banco.

- [ ] Supabase Auth: login, logout, recuperação de acesso; sem cadastro público
- [ ] Convite/ativação e desativação de usuários
- [ ] Modelo de perfis e escopos por módulo; agência/filial/carteira apenas quando homologados **[DECISÃO]**
- [ ] Permissões separadas para rentabilidade, exportação e administração
- [ ] RLS habilitada em todas as tabelas expostas; negar por padrão
- [ ] Controle dos objetos expostos (views/funções) sem `service_role` no navegador
- [ ] Middleware e guardas no servidor; sessão segura
- [ ] Tela administrativa de usuários, perfis e escopos
- [ ] Carteira vinda de cadastro homologado, nunca inferida de `MAX(promotor_003)`
- [ ] Testes de RLS por perfil (leitura, rentabilidade restrita, tentativa direta via API)
- [ ] Revisão de segurança com a skill `senior-secops`

**Commit final:** `feat(auth): Supabase Auth, perfis, escopos e RLS com testes`

---

## M10 — Importador Python na VPS

**Branch:** `milestone/m10-importer`
**Objetivo:** importar as saídas finais dos RPAs com validação, sem alterar os fluxos atuais.

- [ ] Confirmar na VPS caminhos locais, variante dos scripts e agendador ativos **[DECISÃO]**
- [ ] Contratos de esquema por fonte (Aéreo `BI.xlsx`, Terrestre `BI.xlsx`, Operadora/Grupos `0021.csv`) e dos cadastros auxiliares
- [ ] Inventário dos arquivos históricos e dos períodos que cada um cobre, evitando sobreposição
- [ ] Leitura, normalização e validação (arquivo, esquema, período, contagens, regras) com portagem das regras Python/Power Query
- [ ] Cópia versionada dos arquivos por execução, com hash; diretório e trava por execução
- [ ] Carga na staging e chamada da publicação transacional; rejeitar extração incompleta
- [ ] Detecção de arquivos novos/alterados por hash
- [ ] Registro de auditoria sem segredos nem dados pessoais nos logs
- [ ] Credencial técnica de privilégio mínimo; segredos apenas no servidor/VPS
- [ ] Carga inicial do histórico com conferência de períodos
- [ ] Acionamento após o fim bem-sucedido do RPA, sem substituir o fluxo atual
- [ ] Testes com arquivos de exemplo: duplicidade, período inválido, esquema divergente, falha no meio da carga
- [ ] Documentação de operação em `importer/README.md`

**Commit final:** `feat(importer): importador Python com staging, validação e publicação por período`

---

## M11 — Integração da UI com dados reais e paridade

**Branch:** `milestone/m11-real-data-parity`
**Objetivo:** trocar os mocks pelo Supabase e provar que os números batem com o Power BI.

- [ ] Implementar `DataSource` real sobre o Supabase, respeitando RLS
- [ ] Remover dependência dos mocks nos módulos (mantê-los só para testes)
- [ ] Implementar no banco/servidor as medidas pendentes e conferir regras de nulos, divisão por zero e contagem distinta
- [ ] Roteiro de conciliação: mesmos filtros e período contra o Power BI, por módulo e página prioritária
- [ ] Documentar tolerâncias de arredondamento e divergências encontradas **[DECISÃO]**
- [ ] Otimizar consultas lentas (índices, agregações) e paginação onde aplicável
- [ ] Teste de que usuário sem permissão não obtém dado restrito por tela ou consulta
- [ ] Estados de erro e "dados indisponíveis" validados com falhas reais

**Commit final:** `feat(data): integração com Supabase e conciliação de paridade com o Power BI`

---

## M12 — Auditoria, atualização manual e exportação

**Branch:** `milestone/m12-ops-export`
**Objetivo:** operação visível ao administrador e exportação segura.

- [ ] Área administrativa: última carga válida por fonte, execuções, diagnóstico e falhas
- [ ] Página "Auditoria de dados" dos módulos alimentada com dados reais
- [ ] Exibir a data da última carga válida quando houver falha
- [ ] Atualização/reprocessamento manual assíncrono: a aplicação registra o pedido, a VPS processa e a UI acompanha o estado **[DECISÃO]** (habilitação e perfis)
- [ ] Exportação CSV/XLSX respeitando filtros, escopo e permissão de rentabilidade; confirmar limites e resumido x detalhado **[DECISÃO]**
- [ ] Exportação executada no servidor; nada restrito sai pelo cliente
- [ ] Testes de permissão de exportação e de reprocessamento
- [ ] PDF e outros formatos fora desta milestone, salvo aprovação

**Commit final:** `feat(ops): painel de auditoria, reprocessamento assíncrono e exportação autorizada`

---

## M13 — Qualidade, acessibilidade e homologação

**Branch:** `milestone/m13-qa-homologation`
**Objetivo:** validar o produto com critérios de aceite do PRD.

- [ ] Executar os critérios de aceite do PRD, um por um, com evidências
- [ ] Conferência visual das páginas prioritárias com referências renderizadas
- [ ] Acessibilidade: teclado, rótulos, contraste e ausência de cortes
- [ ] Teste de dispositivos/resoluções definidos para homologação **[DECISÃO]**
- [ ] Testes de carga conforme usuários simultâneos estimados **[DECISÃO]**
- [ ] Revisão de segurança final (RLS, segredos, exportação, logs) com `senior-secops` e `code-reviewer`
- [ ] Revisão de performance das páginas e consultas
- [ ] Ajustes encontrados na homologação com o cliente
- [ ] Documentar a matriz final de perfis/permissões aprovada

**Commit final:** `chore(qa): homologação, acessibilidade, segurança e ajustes finais`

---

## M14 — Deploy, operação paralela e entrada em produção

**Branch:** `milestone/m14-deploy`
**Objetivo:** produção estável, com operação paralela ao Power BI até a substituição aprovada.

- [ ] Projeto Vercel com domínio definido pelo cliente; variáveis de ambiente apenas no painel
- [ ] Ambientes de preview e produção separados, cada um com seu projeto Supabase
- [ ] Aplicar migrations em produção com plano de rollback
- [ ] Carga inicial de produção e verificação dos períodos
- [ ] Agendamento/frequência do importador conforme SLA aprovado **[DECISÃO]**
- [ ] Monitoramento e alertas: falha de carga, erros da aplicação, última carga desatualizada
- [ ] Rotina de backup e retenção **[DECISÃO]**
- [ ] Operação paralela com o Power BI e conciliação periódica
- [ ] Documentação de operação e runbook de falhas
- [ ] Aprovação formal para desligamento do Power BI
- [ ] Tag de release

**Commit final:** `chore(release): deploy em produção e operação paralela (v1.0.0)`

---

## Dependências críticas

- **M8** depende do projeto Supabase criado pelo cliente; **M14** depende do domínio e da conta Vercel.
- **M10** depende de acesso à VPS e aos arquivos reais (ou cópias autorizadas) e confirmação do fluxo ativo.
- **M7** depende do modelo de dados do Terrestre (M3/M6); Operadora e Terrestre compartilham `f_Vendas` e dimensões.
- **M9** precisa da matriz de perfis; sem ela, implementar perfis provisórios configuráveis.
- **M11** precisa de acesso ao Power BI (relatórios ou links do Service) para a conciliação.

## Pendências do PRD a resolver durante a execução

Matriz de perfis/carteiras; horários e SLA de carga; retenção; responsáveis pelo 518 e cadastros; páginas legadas em uso; conciliação; orçamento e usuários simultâneos; domínio Vercel e projeto Supabase; links do Power BI Service; agendador atual (n8n?); divergências de regra citadas no PRD.
