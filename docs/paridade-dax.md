# Paridade DAX — medidas portadas e pendentes (M3)

Registro de quais medidas DAX dos três modelos semânticos foram portadas como funções puras TypeScript no M3, e quais ficam pendentes para marcos futuros. Fonte: leitura direta de `*.SemanticModel/definition/tables/*.tmdl` (originais, somente leitura). Regra do [CLAUDE.md](../CLAUDE.md): não unificar fórmulas só por terem o mesmo nome entre módulos.

## Aéreo (`AEREO_PATRIA`)

| Medida DAX | Status | Implementação | Observação |
| --- | --- | --- | --- |
| `Rentabilidade` | Portada | `rules/aereo.ts#calcularRentabilidadeAereo` | `DIVIDE(SUM(rentabilidade_003), SUM(tarifa_003))` |
| `TKT_medio` | Portada | `rules/aereo.ts#calcularTktMedioAereo` | `DIVIDE(SUM(tarifa_003), DISTINCTCOUNT(tkt_003))` |
| `'Meta Rentabilidade Mês Corrente'` | Portada | `rules/aereo.ts#calcularMetaRentabilidadeAereo` | 6% da meta de vendas — **diferente** de Terrestre/Operadora (9%) |
| `'XR ADVP Dias'` (coluna calculada) | Portada | `rules/aereo.ts#calcularDiasAdvp` | `DATEDIFF`, `BLANK()` se data ausente ou embarque < emissão |
| `'XR ADVP Faixa'` (coluna calculada) | Portada | `rules/aereo.ts#classificarFaixaAdvp` | Faixas 0–13/14–20/21–27/28–59/60+ + "Sem data"/"Data inconsistente" |
| `'XR Compra urgente'` (0–1 dia) | Portada | `rules/aereo.ts#isCompraUrgente` | Predicado auxiliar; agregação completa fica para M5 (xray) |
| `'XR Margem negativa'` | Portada | `rules/aereo.ts#isMargemNegativa` | Predicado auxiliar |
| `'XR Vendas'`, `'XR Lucro'`, `'XR Margem'`, `'XR Bilhetes'`, `'XR Ticket medio'`, `'XR Lucro por bilhete'`, `'XR Emissoes'`, `'XR Meses ativos'`, `'XR Recorrencia'`, `'XR Ultima compra'`, `'XR Dias sem compra'`, `'XR ADVP mediano/medio/validos/cobertura'`, `'XR Destinos'`, `'XR Rotas'`, `'XR Vendas AA'`, `'XR Crescimento AA'`, `'XR Concentracao CIA/destino'`, `'XR Janela 12/13 meses'` | Pendente | — | Agregações sobre o dataset completo (não só por linha); portar no M5 (página xray), que já tem marco próprio no PLAN.md |
| `'Meta Executivo Mês Corrente'`, `'Vendas Executivo Mês Corrente'`, `'% Atingimento Meta Executivo/Rentabilidade'`, `'Gap Meta Executivo/Rentabilidade'`, `'Dias Restantes Mês'`, `'Meta Diária Necessária/Rentabilidade Necessária'`, `'Status Meta Executivo/Rentabilidade'` | Pendente | — | Dependem de contexto de filtro de calendário (mês selecionado); portar no M4 (página Metas) |
| `Churn_Real`, `AgenciasInativas_MesAnterior`, `TotalAgenciasUnicas_MesAtualEAnterior` | Pendente | — | Portar no M4 (Agências inativas) |
| `'Agência Não Comprou no Mês'`, `'Valor Venda Última Compra (Mês)'` | Pendente | — | Portar no M4 (Agências) |
| **`'XR Bilhetes'` vs `'XR Vendas'`** | Divergência conhecida, **não corrigir** | — | O gráfico do painel intitulado "Bilhetes" usa a medida `'XR Vendas'` (soma de `tarifa_003`), não `'XR Bilhetes'` (contagem de `tkt_003`). Confirmado literalmente no DAX. Registrado também no CLAUDE.md. |
| `'Rentabilidade Frontur'` | Fora de escopo do M3 | — | Painel Frontur é fato separado (`F_Frontur`), com campos próprios `Rent`/`Tarifa` — não confundir com `rentabilidade_003`/`tarifa_003` |
| Medidas de metas por companhia (`Alvo_Meta*`, `AlcancarMeta*`, `*_AD`, `*_G3`, `*_AFKL EUR`) | Pendente | — | Dependem de tabelas de metas por companhia (LATAM/Azul/Gol/NDC), fora do escopo do M3; avaliar no M4/M5 |

## Terrestre (`TERRESTRE_PATRIA`)

| Medida DAX | Status | Implementação | Observação |
| --- | --- | --- | --- |
| `Rentabilidade` | Portada | `rules/terrestre.ts#calcularRentabilidadeTerrestre` | Mesma fórmula do Aéreo (`rentabilidade_003`/`tarifa_003`), implementação própria — não importa de `rules/aereo.ts` |
| `TKT_medio` | Portada | `rules/terrestre.ts#calcularTktMedioTerrestre` | Idêntica estrutura ao Aéreo |
| `'Meta Rentabilidade Mês Corrente'` | Portada | `rules/terrestre.ts#calcularMetaRentabilidadeTerrestre` | **9%** da meta de vendas — confirmado diferente do Aéreo (6%) |
| `'Qtde Diárias'` | Portada | `rules/terrestre.ts#calcularQtdeDiarias` | `SUMX(DATEDIFF(checkin, checkout, DAY))` — exclusiva do Terrestre (não existe no Aéreo) |
| `TotalAgenciasUnicas_MesAtualEAnterior_Mesmo_Periodo`, `Churn_Real`, `AgenciasInativas_MesAnterior`, `TotalAgenciasUnicas_MesAtualEAnterior` | Pendente | — | Portar no M6 (Agências inativas) |
| `'Meta Executivo Mês Corrente'` e medidas de meta/status associadas | Pendente | — | Portar no M6 (Metas) |
| Não há medidas `XR *` | N/A | — | Terrestre não tem página xray (confirmado no PRD e na ausência de colunas/medidas XR no modelo) |

## Operadora (`OPERADORA_PATRIA`)

| Medida DAX | Status | Implementação | Observação |
| --- | --- | --- | --- |
| `Rentabilidade` | Portada | `rules/operadora.ts#calcularRentabilidadeOperadora` | `DIVIDE(SUM(Total), SUM(TotalRecebimento))` — campos próprios, **não** `rentabilidade_003`/`tarifa_003` |
| `'Rentabilidade Executivo Mês Corrente'` (parcial) | Portada | `rules/operadora.ts#calcularRentabilidadeExecutivoOperadora` | `SUM(Total)` — valor absoluto, não uma divisão; aqui "Total" faz o papel de rentabilidade bruta |
| `'Meta Rentabilidade Mês Corrente'` | Portada | `rules/operadora.ts#calcularMetaRentabilidadeOperadora` | 9% da meta de vendas — igual ao Terrestre, diferente do Aéreo |
| `TKT_medio` | **Não aplicável** | — | Referencia `f_Vendas`/`tkt_003`/`tarifa_003`, tabela que **não existe** no modelo da Operadora (só `f_Operadora`/`f_Grupos`). Resíduo do template DAX compartilhado entre os 3 modelos, não adaptado. Não portar sem decisão registrada. |
| `'Vendas Ano Anterior (mesmo período)'` | **Não aplicável** | — | Mesma situação: referencia `f_Vendas[tarifa_003]`/`f_Vendas[dataemissao_003]`, inexistentes na Operadora |
| `'Qtde Diárias'` | **Não aplicável** | — | Referencia `f_Vendas[checkin]`/`[checkout]`, inexistentes na Operadora (campos do Terrestre) |
| `TotalAgenciasUnicas_MesAtualEAnterior_Mesmo_Periodo` | **Não aplicável / quebrada na origem** | — | Referencia uma tabela `BI` com colunas `[Agência]`/`[Data Emissão]` que não existe em nenhum `.tmdl` do modelo. Provável tabela oculta não migrada ou medida órfã. Não portar sem confirmar origem com o cliente. |
| `'Vendas Mês Atual/Anterior (até Hoje)'`, `IndicadorVendas`, `'Vendas Executivo Mês Corrente'`, `Churn_Real`, `AgenciasInativas_MesAnterior`, `TotalAgenciasUnicas_MesAtualEAnterior` | Pendente | — | Mesma lógica do Aéreo, mas sobre `f_Operadora[Emissao]`/`[TotalRecebimento]`/`[Cliente]`; portar no M7 |
| `'Meta Executivo Mês Corrente'` e medidas de meta/status associadas | Pendente | — | Portar no M7 (Metas) |

## Convenções usadas nesta tabela

- **Portada**: função pura implementada em `apps/web/src/lib/rules/` com testes em M3.
- **Pendente**: medida real e aplicável, mas que depende de página/contexto fora do escopo do M3 (ex.: filtro de mês selecionado, página xray) — tem marco próprio no `PLAN.md`.
- **Não aplicável**: medida presente no arquivo DAX mas que referencia tabela/coluna inexistente no próprio modelo (resíduo de template compartilhado entre Aéreo/Terrestre/Operadora). Não deve ser implementada como está; exige decisão do cliente se algum dia for necessária.
- **Divergência conhecida**: comportamento intencionalmente preservado do Power BI mesmo sendo aparentemente incorreto, por já estar documentado como tal no CLAUDE.md/PRD. Não corrigir sem decisão registrada.
