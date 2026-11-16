# ADR 0001 — Biblioteca de gráficos e matrizes

**Status:** Aceito
**Milestone:** M2 — Protótipo de fidelidade de gráficos e matrizes
**Branch:** `milestone/m02-chart-prototype`

## Contexto

O CLAUDE.md define que a biblioteca de gráficos/matrizes só deve ser escolhida após
um protótipo de fidelidade (hierarquias, subtotais, matrizes), comparado com
referências renderizadas do Power BI. Este documento registra o levantamento, o
protótipo construído em `/dev/chart-prototype` e a decisão.

### Levantamento de tipos de visual necessários

Contagem extraída de `inventario_power_bi.json` (inspeção estática das 30 páginas dos
três relatórios `AEREO_PATRIA`, `TERRESTRE_PATRIA`, `OPERADORA PÁTRIA`):

| Tipo de visual Power BI | Total | Aéreo | Terrestre | Operadora |
| --- | --- | --- | --- | --- |
| `slicer` (filtro) | 273 | 144 | 77 | 52 |
| `image` | 245 | 108 | 63 | 74 |
| `card` | 70 | 33 | 17 | 20 |
| `clusteredBarChart` | 27 | 13 | 8 | 6 |
| `pivotTable` (matriz) | 25 | 11 | 6 | 8 |
| `actionButton` | 50 | 33 | 9 | 8 |
| `shape` | 46 | 18 | 13 | 15 |
| `textbox` | 24 | 10 | 7 | 7 |
| `multiRowCard` | 17 | 5 | 5 | 7 |
| `clusteredColumnChart` | 10 | 5 | 2 | 3 |
| `donutChart` | 9 | 5 | 4 | 0 |
| `lineChart` | 5 | 5 | 0 | 0 |
| `cardVisual` | 4 | 4 | 0 | 0 |
| `columnChart` | 2 | 2 | 0 | 0 |
| `lineClusteredColumnComboChart` | 1 | 1 | 0 | 0 |

Conclusão do levantamento: o essencial para o M2 é **barras agrupadas, rosca** (os
gráficos mais usados fora de card/slicer/decoração) e, mais criticamente, o
**`pivotTable`** — usado em quase toda página de dados, sempre com hierarquia
(ex.: Executivo → Ano → Mês) e colunas calculadas (`Sum`, `Divide` para % do total,
`ScopedEval`). A fidelidade da matriz pesa mais que a dos gráficos porque é onde o
Power BI concentra subtotais, hierarquia e as medidas DAX mais sensíveis às regras do
CLAUDE.md (nulos ≠ zero, não somar domínios sem homologação).

Exemplo real inspecionado — `pivotTable` "Cias aéreas" na página Vendas do Aéreo:
linhas agrupadas por `promotor_003` (Executivo) → hierarquia de datas (Ano/Mês),
colunas com `Sum(tarifa_003)`, `Sum(tkt_003)`, `Divide(Sum(tarifa_003), ScopedEval(...))`
e `Sum(rentabilidade_003)`. O protótipo da matriz (`vendasMatrixData` em
`apps/web/src/app/dev/chart-prototype/fixtures.ts`) espelha essa estrutura.

## Candidatas avaliadas

| Categoria | Candidata A | Candidata B |
| --- | --- | --- |
| Gráficos | **Recharts** 3.10.1 | **ECharts** 6.1.0 (via `echarts-for-react` 3.0.6) |
| Matrizes | **TanStack Table** 8.21.3 (headless) | **Material React Table** 3.2.1 |

AG Grid (Community/Enterprise) foi descartado antes do protótipo por decisão do
cliente: o pivot/row-grouping avançado comparável ao `pivotTable` do Power BI exige
licença Enterprise paga, o que viola a preferência por soluções 100% abertas.

**Chart.js também foi considerado** a partir de `Vendas Região Sul.html` (artifact de
análise avulso, não referência do Power BI nem protótipo de produto) encontrado na
raiz do repositório, que usa Chart.js 4.4.1 com visual elogiado pelo cliente. Inspeção
do código mostrou que o efeito vem majoritariamente de estilização manual por cima da
lib — paleta com variáveis CSS e suporte a dark mode, `borderRadius`/`maxBarThickness`
nas barras, e principalmente um **plugin customizado** (`afterDatasetsDraw`) que
desenha o rótulo de valor total acima de cada barra, recurso que o Chart.js não
oferece pronto. O Recharts (já candidato) tem o equivalente nativo via
`<LabelList position="top">`, sem precisar de plugin — ver `showValueLabels` em
`recharts-bar-chart.tsx` e a seção "Barras com rótulo de valor" no protótipo. Decisão:
não adicionar Chart.js como terceira candidata; a técnica visual foi incorporada ao
wrapper Recharts já escolhido.

Protótipo construído em `apps/web/src/app/dev/chart-prototype/page.tsx` (rota interna,
fora da navegação de produto) durante a avaliação, comparando as 4 bibliotecas lado a
lado. Evidência visual em `docs/adr/evidencias/0001-chart-prototype.png`. Após a
decisão, os wrappers e dependências de ECharts e Material React Table foram removidos
do pacote (não fazem parte da base de código final) — ficam apenas os wrappers
escolhidos em `src/components/charts/` (Recharts) e `src/components/matrix/`
(TanStack Table).

## Critérios e resultado

### Fidelidade visual (barras + rosca)

Ambas reproduzem fielmente a paleta de marca (roxo `#5208A5`, vermelho `#C82727`) e os
formatos pt-BR via `Intl.NumberFormat`. Diferença relevante: **Recharts** resolve
`var(--color-chart-N)` nativamente como `fill` (é só CSS/SVG por baixo). **ECharts**
não resolve custom properties CSS sozinho — a cor teria caído em preto/cinza (bug
observado no protótipo) até adicionarmos `resolveCssColor()`
(`src/components/charts/resolve-css-color.ts`), que lê o valor computado do DOM antes
de montar a opção do gráfico. Isso é uma complexidade a mais para manter fidelidade de
tema no ECharts.

### Matriz com hierarquia e subtotais

Ambas resolvem o caso central do `pivotTable`: agrupamento multi-nível
(Executivo → Mês → Cia) com subtotal por `aggregationFn` customizada. O caso de borda
mais importante do PRD — um grupo onde **todas** as linhas têm `rentabilidade: null`
(sem permissão/dado) deve subtotalizar para "—", nunca "R$ 0,00" — foi implementado e
testado nas duas (`sumPreservingNull`, `src/components/matrix/aggregations.ts`,
reaproveitada por ambos os wrappers e coberta por
`src/components/matrix/aggregations.test.ts`).

- **TanStack Table**: headless, controle total de markup/acessibilidade, zero
  dependência de design system alheio. Custo: mais código nosso para expand/collapse,
  indentação por profundidade e estilização (tudo escrito à mão em
  `tanstack-sales-matrix.tsx`).
- **Material React Table**: grouping/expand/subtotal prontos via `enableGrouping`,
  menos código nosso. Custo: traz `@mui/material` + `@emotion/*` como dependências de
  produção só para a tabela, e exige envolver em `ThemeProvider` para não vazar o
  visual padrão do Material Design — mitigado com um tema mínimo
  (`brandTheme` em `mrt-sales-matrix.tsx`), mas é uma segunda linguagem visual a
  manter sincronizada com os tokens Tailwind/shadcn do resto do app.

**Achado técnico decisivo**: `@tanstack/react-table` na major mais recente (9.x) é uma
reescrita completa com API nova (`useTable`, sem `useReactTable`/`getCoreRowModel`),
incompatível com o ecossistema atual — o próprio pacote outro inclui um guia
`skills/migrate-v8-to-v9`. O Material React Table 3.2.1 ainda depende internamente da
v8 (`@tanstack/react-table@8.20.6` nas suas próprias `dependencies`). Fixamos nosso
wrapper headless em **8.21.3** (última da v8) para ficar na mesma major que o
ecossistema de tabelas React usa hoje — rodar a v9 teria exigido reescrever o wrapper
numa API que nenhuma outra lib do espaço ainda adotou.

### Desempenho e bundle

- O chunk de produção que combina ECharts + MUI/Emotion (ambos carregados juntos só
  porque o protótipo compara as 4 bibliotecas na mesma rota) ficou em **2,4 MB**
  (não minificado por tree-shaking seletivo — o wrapper importa `echarts` completo em
  vez de `echarts/core` + módulos específicos). Em produção, apenas uma biblioteca de
  cada categoria entraria no bundle real, então esse número não é o custo final, mas
  expõe que **ECharts via import completo é pesado por padrão** — mitigável com
  imports seletivos (`echarts/core`, `echarts/charts/BarChart`, etc.), trabalho que a
  biblioteca escolhida precisa adotar nas próximas milestones.
- **Material React Table** adiciona duas dependências inteiras de produção
  (`@mui/material`, `@emotion/*`, ~18 MB em disco) só para a tabela — alto custo fixo
  mesmo usando poucos recursos do Material Design.
- **TanStack Table** headless é a mais leve (~800 KB em disco, sem dependências de UI).
- Após a decisão e a remoção de `echarts`, `echarts-for-react`, `material-react-table`,
  `@mui/material` e `@emotion/*` do `package.json`, o maior chunk JS gerado pelo
  `next build` caiu de 2,4 MB para **456 KB** — confirma que o custo acima era das
  bibliotecas descartadas, não de Recharts + TanStack Table.
- **Recharts** é consideravelmente mais simples de popular com os tokens de tema já
  existentes (`--color-chart-1..5` em `globals.css`), sem exigir resolução manual de
  CSS custom properties.

### Acessibilidade

Ambas as matrizes usam `<table>`/`<th>`/`<td>` semânticos; TanStack Table permitiu
marcar `aria-expanded` nos botões de grupo manualmente, Material React Table já expõe
isso pronto. Para os gráficos, nenhuma das duas libs resolve acessibilidade de gráfico
(leitura por teclado/screen reader de séries) de fábrica — ambas exigiriam camada
própria de texto alternativo/tabela de dados paralela, fora do escopo deste M2.

### Integração com Next.js 16 (Cache Components)

Achado operacional relevante para qualquer biblioteca client-heavy neste projeto:
`@tanstack/react-table` v8's `getHeaderGroups()` chama `Date.now()` internamente, o
que o Next 16 com Cache Components trata como valor não determinístico durante
prerender — a página precisou envolver o componente em `<Suspense>` (ver
`chart-prototype/page.tsx`) para não quebrar com
`unstable_blocking-prerender-current-time`. ECharts/Recharts não tiveram esse
problema. Isso não elimina TanStack Table, mas é um detalhe de integração a repetir em
toda página real que usar a matriz.

### Limitação: comparação com referência renderizada do Power BI

O CLAUDE.md exige comparar com "referências renderizadas do Power BI (capturas)", não
só com o JSON do layout. Esta sessão não teve acesso ao Power BI Desktop/Service para
abrir os relatórios e capturar telas reais — a comparação feita aqui usa o
**inventário estrutural** (`inventario_power_bi.json`: tipos de visual, campos e
agregações configuradas em cada `pivotTable`/gráfico) como proxy, não uma captura
visual lado a lado. É uma limitação real, não um item concluído por completo:
a conferência com captura renderizada de fato fica pendente e deve acontecer no M4
(primeira página completa do Aéreo), quando houver acesso ao Power BI ou a capturas
fornecidas pelo cliente para comparar pixel a pixel.

## Decisão

- **Gráficos: Recharts.** Resolve os tokens de tema nativamente, API declarativa mais
  simples de popular rapidamente nas ~15 páginas restantes, e o inventário real do
  Power BI não exige nenhum recurso que só o ECharts ofereça (sem mapas, sem
  3D, sem grandes volumes por visual — o maior volume fica nas matrizes, não nos
  gráficos). Risco aceito: menos performático que ECharts em datasets muito grandes
  (milhares de pontos por série) — não é o caso de nenhum gráfico do inventário
  (xray usa evolução mensal, não série bruta).
- **Matrizes: TanStack Table (headless, v8.21.3).** Evita adicionar
  `@mui/material`/`@emotion` como dependência de produção só para a tabela — o app já
  tem shadcn/ui + Tailwind como sistema de design, e duplicar isso com Material Design
  teria custo de manutenção maior que o código extra de grouping/expand que
  escrevemos à mão. O código do wrapper (`tanstack-sales-matrix.tsx`) fica como base a
  reaproveitar/estender no M4 em diante.

## Riscos e mitigação

- **ECharts não ficou selecionado**, mas se alguma página futura (ex.: mapas de
  rotas/destinos, caso apareça no M5 xray) precisar de um visual que o Recharts não
  cobre, reavaliar pontualmente — os wrappers ficam isolados em
  `src/components/charts/`, trocar a implementação interna não deveria vazar para as
  páginas que os consomem.
- **TanStack Table v8 vs v9**: fixamos em v8.21.3 propositalmente. Se o ecossistema
  (Material React Table e outros) migrar para v9 no futuro, reavaliar — por ora, v9
  tem API ainda não adotada por nenhuma lib de UI sobre tabelas.
- **Import completo do ECharts não se aplica** (biblioteca não selecionada), então o
  ponto fica apenas registrado para referência caso a decisão seja revisitada.

## Testes dos wrappers

- `src/components/matrix/aggregations.test.ts` — `sumPreservingNull`: soma normal,
  null tratado como 0 quando há dado real no grupo, grupo 100% null retorna null (não
  0), soma de zeros reais não é confundida com ausência de dado.
- `src/components/matrix/tanstack-sales-matrix.test.tsx` — agrupamento e subtotal de
  tarifa, "—" em vez de "R$ 0,00" quando o grupo inteiro não tem permissão, linha com
  valores zero não quebra o render.
- `src/components/charts/charts.test.tsx` — RechartsBarChart/RechartsDonutChart
  renderizam a legenda e os setores esperados; categoria com valor zero não quebra o
  eixo. Requer stub de `ResizeObserver` disparando a medição manualmente, porque
  `ResponsiveContainer` não mede nada em jsdom sem isso (documentado no próprio teste).
- `src/components/charts/resolve-css-color.test.ts` — resolução de `var(--token)` para
  o valor computado, fallback para cor literal e para token indefinido.

Material React Table não tem teste de render dedicado: a lógica de agregação que
importa (`sumPreservingNull`) já é coberta isoladamente e reaproveitada pelos dois
wrappers; testar o render do MRT em si teria testado a biblioteca de terceiros, não
nosso código.
