# PROJECT ARCHITECTURE: BI Web Pátria

## 1. CONTEXT & PROBLEM

A Pátria Consolidadora utiliza atualmente os relatórios AEREO_PATRIA, TERRESTRE_PATRIA e OPERADORA PÁTRIA no Power BI. Segundo o cliente, o modelo atual de licenciamento gera custo adicional ao ampliar o número de usuários e reduz a competitividade da solução. A economia esperada deve ser quantificada considerando também os custos da nova infraestrutura.

O cliente deseja maior liberdade para evoluir a experiência web em React, preservando a máxima semelhança possível com o visual, as análises e as regras que os usuários já conhecem. A migração precisa manter confiança nos números e familiaridade de navegação.

Hoje, automações Python já funcionam em uma VPS: acessam o Wooffice, baixam relatórios, fazem cruzamentos e geram CSV/Excel. A extração corrente cobre do dia 01 até a data da coleta e substitui integralmente o arquivo anterior; históricos ficam em outros arquivos. Dados e regras estão distribuídos entre scripts, arquivos auxiliares, Power Query e DAX, dificultando rastreabilidade, manutenção, controle de versões e acesso web centralizado.

Não existem chaves de negócio confiáveis por linha para um upsert convencional: identificadores de venda se repetem e a chave_unicidade está vazia nas amostras do Aéreo. Há diferenças de esquema e tratamentos específicos entre as bases. É necessário migrar o histórico ao Supabase e atualizar retratos completos por fonte/período, com validação, auditoria e preservação da última carga válida.

Também é necessário administrar usuários e escopos, incluindo rentabilidade e exportação. Os botões atuais de ocultar valores não representam uma política de autorização. A matriz definitiva de perfis/permissões ainda precisa ser homologada.

## 2. PROPOSED SOLUTION

Construir o BI Web Pátria: aplicação web interna para a Pátria Consolidadora, desenvolvida com Claude Code, interface React/Next.js em TypeScript hospedada na Vercel e Supabase como Postgres, autenticação e controle de acesso. Ter módulos Aéreo, Terrestre e Operadora, respeitando as dependências de Grupos e cadastros auxiliares. Não assumir um SaaS comercial multiempresa nesta V1.

Reproduzir os visuais, filtros, hierarquias, matrizes, indicadores e navegação relevantes do Power BI com máxima fidelidade. O inventário contém 30 páginas e 830 objetos, incluindo decoração e páginas ocultas; aprovar o escopo por página, sem transformar automaticamente toda página oculta/duplicada em rota de produção.

Reaproveitar os RPAs existentes na VPS. Criar um importador independente, acionado após geração bem-sucedida, que leia as saídas finais já utilizadas pelo Power BI e as fontes auxiliares. Manter o fluxo atual para operação paralela e conciliação durante a migração. Não reescrever a coleta do Wooffice nesta primeira entrega.

Fazer carga inicial do histórico conferindo períodos e sobreposições. Em cada atualização, carregar o retrato completo da fonte/período em uma área intermediária; validar arquivo, esquema, período, contagens e regras; publicar por transação, substituindo integralmente o recorte daquela fonte e mês e preservando os demais meses. Não comparar ou fazer upsert por linha com chaves não confiáveis. Extração incompleta ou inválida não pode substituir a base publicada.

Guardar versões dos arquivos por execução para auditoria e registrar origem, hash, período, horários, contagens e resultado. Na falha, manter a última carga válida e informar sua data. Reprocessar históricos alterados de forma controlada.

Entregar incrementalmente: fundações e homologação do Aéreo, seguidas de Terrestre e Operadora/Grupos no mesmo produto. Conciliar resultados com o Power BI antes da substituição operacional. Prazos, orçamento, usuários simultâneos, frequência de atualização e SLAs ficam pendentes de definição.

## FONTES DE DADOS — ENDEREÇOS PARA IMPLEMENTAÇÃO

Origem primária: https://wooffice.patria.tur.br/ — sistema do qual os RPAs existentes exportam os relatórios. Não foi confirmada uma API oficial. O novo importador deve ler os arquivos finais produzidos na VPS, após geração e validação.

As consultas Power Query salvas usam `M:\scripts\patria`. O acesso utilizado na inspeção foi `\\10.10.10.1\m2s\scripts\patria`. São endereços privados: o ambiente do copiloto precisa ter acesso à rede ou receber cópias autorizadas. Na VPS, confirmar os caminhos locais correspondentes. Não assumir acesso da Vercel ao compartilhamento.

### Aéreo — AEREO_PATRIA / f_Vendas

- Pasta consumida no Power BI (caminho salvo): `M:\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\dataset`.
- Pasta equivalente acessada na rede, incluindo históricos: `\\10.10.10.1\m2s\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\dataset`.
- Arquivo corrente final: `\\10.10.10.1\m2s\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\dataset\BI.xlsx`.
- Script principal: `\\10.10.10.1\m2s\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\main.py`.
- Fluxo de scripts na mesma pasta: `baixa_rede.py → baixa_BI.py → baixa_003.py → unifica_BI.py`. Rotina de mês anterior: `periodo_anterior.py`. Confirmar qual variante e agendamento estão ativos.

### Terrestre — TERRESTRE_PATRIA / f_Vendas

- Pasta consumida no Power BI (caminho salvo): `M:\scripts\patria\BI_TERRESTRE\Sripts\Baixa_arquivos\dataset`.
- Pasta equivalente acessada na rede, incluindo históricos: `\\10.10.10.1\m2s\scripts\patria\BI_TERRESTRE\Sripts\Baixa_arquivos\dataset`.
- Arquivo corrente final: `\\10.10.10.1\m2s\scripts\patria\BI_TERRESTRE\Sripts\Baixa_arquivos\dataset\BI.xlsx`.
- Script principal: `\\10.10.10.1\m2s\scripts\patria\BI_TERRESTRE\Sripts\Baixa_arquivos\main.py`.
- Fluxo de scripts na mesma pasta: `baixa_rede.py → baixa_BI.py → baixa_003.py → unifica_BI.py`. Rotina de mês anterior: `periodo_anterior.py`. Confirmar qual variante e agendamento estão ativos.

### Operadora — OPERADORA PÁTRIA / f_Operadora

- Pasta consumida no Power BI (caminho salvo): `M:\scripts\patria\BI_OPERADORA\scripts\0021`.
- Pasta equivalente acessada na rede, incluindo históricos: `\\10.10.10.1\m2s\scripts\patria\BI_OPERADORA\scripts\0021`.
- Arquivo corrente final: `\\10.10.10.1\m2s\scripts\patria\BI_OPERADORA\scripts\0021\0021.csv`.
- Script principal: `\\10.10.10.1\m2s\scripts\patria\BI_OPERADORA\scripts\main.py`.
- Fluxo de scripts na mesma pasta: `rpa_patria.py → process_csv.py`. Rotina de mês anterior: `periodo_anterior.py`. Confirmar qual variante e agendamento estão ativos.

### Grupos — dependência da Operadora / f_Grupos

- Pasta consumida no Power BI (caminho salvo): `M:\scripts\patria\BI_GRUPOS\scripts\0021`.
- Pasta equivalente acessada na rede, incluindo históricos: `\\10.10.10.1\m2s\scripts\patria\BI_GRUPOS\scripts\0021`.
- Arquivo corrente final: `\\10.10.10.1\m2s\scripts\patria\BI_GRUPOS\scripts\0021\0021.csv`.
- Script principal: `\\10.10.10.1\m2s\scripts\patria\BI_GRUPOS\scripts\main.py`.
- Fluxo de scripts na mesma pasta: `rpa_patria.py → process_csv.py`. Rotina de mês anterior: `periodo_anterior.py`. Confirmar qual variante e agendamento estão ativos.

### Histórico e dependências entre relatórios

O Power Query combina arquivos das pastas; o histórico não se limita ao arquivo corrente. A carga inicial deve inventariar os arquivos e seus períodos para evitar sobreposição. Depois, a atualização substitui o retrato completo da fonte/mês validado, preservando os outros períodos e a última carga válida em caso de falha. Não usar identificadores de venda como chave única por linha.

A Operadora também mantém `f_Vendas` e dimensões ligadas ao dataset do Terrestre; `f_Grupos` vem da rotina independente de Grupos. Os três relatórios não constituem três fontes isoladas.

### Cadastros, metas e fontes auxiliares identificadas

Os caminhos abaixo foram extraídos das consultas dos modelos salvos. A existência de uma referência não comprova que seu gerador, manutenção e atualização estejam homologados.

- Clientes — três relatórios: `\\10.10.10.1\m2s\scripts\patria\CLIENTES\clientes.xlsx`.
- Frontur — Aéreo: `\\10.10.10.1\m2s\scripts\patria\FRONTUR\BI.xlsx`.
- Metas de companhias — Aéreo: `\\10.10.10.1\m2s\scripts\patria\METAS\METAS\METAS.xlsx`.
- Meta NDC LATAM — Aéreo: `\\10.10.10.1\m2s\scripts\patria\METAS\METAS\NDC LATAM.xlsx`.
- Metas por promotor — Aéreo: `\\10.10.10.1\m2s\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\META_PROMOTOR\META_AEREO_PROMOTOR.xlsx`.
- Metas por promotor — Terrestre: `\\10.10.10.1\m2s\scripts\patria\BI_TERRESTRE\Sripts\Baixa_arquivos\META_PROMOTOR\META_AEREO_PROMOTOR.xlsx`.
- Metas por promotor — Operadora: `\\10.10.10.1\m2s\scripts\patria\BI_OPERADORA\scripts\META_PROMOTOR\META_AEREO_PROMOTOR.xlsx`.
- Aeroportos — Aéreo: `\\10.10.10.1\m2s\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\AEROPORTOS\Aeroportos.xlsx`.
- Aeroportos — Terrestre e Operadora: `\\10.10.10.1\m2s\scripts\patria\BI_TERRESTRE\Sripts\Baixa_arquivos\AEROPORTOS\Aeroportos.xlsx`.
- Aeroportos Brasil — três relatórios: `\\10.10.10.1\m2s\scripts\patria\AEROPORTOS_BR\Aeroportos_Brasil_Completo.xlsx`.
- Companhias — pasta lida pelo modelo Aéreo: `\\10.10.10.1\m2s\scripts\patria\CIAS`.
- Viagem global — pasta lida pelos três modelos: `\\10.10.10.1\m2s\scripts\patria\BI`.
- Redes — arquivo lido diretamente pela Operadora: `\\10.10.10.1\m2s\scripts\patria\BI_AEREO\Sripts\Baixa_arquivos\redes\REDES.xlsx`.

Nos pipelines Aéreo/Terrestre, `baixa_BI.py` também usa `518_INC\518.xlsx`, aeroportos e redes antes de gerar o dataset final. O 518 é uma dependência de enriquecimento; sua geração, responsável e rotina de atualização continuam pendentes. Redes também já aparecem incorporadas aos datasets, e algumas dimensões são derivadas deles.

### Referências para conferir regras e contratos das fontes

Levantamento detalhado: https://app.notion.com/p/41a457f8704281328081da9819d49799

Modelos locais para consultar Power Query, tipos e relacionamentos:
- `E:\Pátria\Novo BI\AEREO_PATRIA\AEREO_PATRIA.SemanticModel\definition`
- `E:\Pátria\Novo BI\TERRESTRE_PATRIA\TERRESTRE_PATRIA.SemanticModel\definition`
- `E:\Pátria\Novo BI\OPERADORA PÁTRIA\OPERADORA_PATRIA.SemanticModel\definition`

O endereço do projeto Supabase e o domínio da aplicação Vercel ainda não foram definidos/fornecidos. Não inventar esses endereços nem inserir credenciais no PRD.



## 3. FUNCTIONAL REQUIREMENTS

- Dashboards
- Login e Autenticação
- Multi usuário
- Permissões por usuário
- Relatórios e Exportação
- Integrações (API)
- Busca e Filtros
- Calendário
- Notificações

ESCOPO FUNCIONAL DA V1

RF01 — Autenticação e usuários: acesso restrito com Supabase Auth; login, logout, recuperação de acesso, convite/ativação e desativação. Gestão administrativa de perfis e escopos. Não criar cadastro público aberto sem aprovação.

RF02 — Permissões: autorização no servidor/banco, com RLS e controle dos objetos expostos. Escopos por módulo e, quando homologados, agência/filial/carteira. Acesso à rentabilidade e a exportações deve ser separado da ação visual de ocultar/exibir. Ocultar componentes não basta para impedir consulta/exportação. Negar acessos sem regra explícita. Matriz final e perfis devem ser homologados.

RF03 — Módulos Aéreo, Terrestre e Operadora, com navegação consistente. Páginas comuns: Capa, Auditoria de dados, Vendas, Agências, Executivos, Metas e Share diário. Aéreo acrescenta Cias, Cias Frontur, Agências inativas e xray; Terrestre acrescenta Produtos e Agências inativas; Operadora acrescenta Produtos e Produtos X Grupos. Duplicata de Executivos e páginas legadas/ocultas exigem decisão de ativação; preservar referências sem descarte silencioso.

RF04 — Visuais e filtros: cartões, barras, colunas, linhas, roscas, tabelas/matrizes com ordenação, hierarquias, subtotais, formatos e interações equivalentes às aprovadas. Filtros conforme cada página: emissão, agência, executivo/promotor, rede, mentoria, companhia, filial, nacional/internacional, origem/destino, sistema, produto, fornecedor, cabine e outros do inventário. Incluir limpar filtros e estados de carregamento, erro, sem resultado e dados indisponíveis. Calendário é filtro de dados, não módulo de agenda.

RF05 — xray: desempenho, vendas, lucro/rentabilidade, bilhetes, ticket médio, recorrência, última compra, concentração, evolução mensal, sazonalidade, rotas, destinos, cabines e antecedência ADVP. Reproduzir a independência dos gráficos mensais cujo filtro de data foi explicitamente desabilitado. Faixas ADVP: 0–13, 14–20, 21–27, 28–59 e 60+ dias, com estados sem data/data inconsistente. Compra urgente: 0–1 dia.

RF06 — Paridade: portar regras de Python, Power Query e DAX com tratamento equivalente de nulos, divisão por zero, contagem distinta, filtros e datas. Aéreo/Terrestre: rentabilidade_003/tarifa_003; Operadora: Total/TotalRecebimento. Não unificar fórmulas por terem nomes iguais. Não somar domínios sem homologar seus escopos.

RF07 — Importação: consumir as saídas finais dataset de Aéreo/Terrestre e 0021 de Operadora/Grupos; importar clientes, metas, aeroportos, redes, 518 e demais insumos necessários. Identificar arquivos novos/alterados por versão/hash. Contrato de esquema por fonte. Não presumir igualdade entre as bases. Históricos podem representar vários meses e precisam de mapa de cobertura.

RF08 — Retratos completos: unidade de substituição = fonte + mês/período declarado. A coleta corrente do dia 01 até a coleta substitui o retrato anterior desse mês. Publicar após validação e em uma transação; preservar os demais períodos. Não depender de vendaid, Venda, bilhete ou chave_unicidade como chave única de negócio. Repetir a mesma carga não pode duplicar resultados. Carga parcial não pode apagar o restante de um período.

RF09 — Operação/auditoria: identificar cada execução; manter cópia versionada dos arquivos; registrar período, hash, versão das regras, início/fim, linhas lidas/publicadas/rejeitadas, validações e falhas sem expor segredos ou dados pessoais nos logs. Área administrativa com última carga válida por fonte, execuções e diagnóstico. Travas e diretórios por execução impedem mistura de períodos.

RF10 — Atualização manual: administrador autorizado pode solicitar carga/reprocessamento assíncrono, se habilitado. A VPS processa e a aplicação acompanha o estado; não manter requisição da Vercel aguardando o RPA. Frequência automática e perfis de disparo devem ser homologados.

RF11 — Exportação: CSV/XLSX de dados autorizados, respeitando filtros, escopos e permissão de rentabilidade. Confirmar limites e dados resumidos/detalhados. PDF/outros formatos dependem de aprovação.

RF12 — Experiência: prioridade desktop com responsividade, teclado, rótulos acessíveis, contraste adequado e ausência de cortes. Adaptar menus/filtros ao celular e permitir rolagem controlada de tabelas largas. Confirmar dispositivos/resoluções de homologação.

CRITÉRIOS DE ACEITE
- Mesmos filtros/período produzem os indicadores homologados do Power BI, com tolerâncias de arredondamento documentadas.
- Usuários sem permissão não obtêm dados restritos por tela, consulta ou exportação.
- Carga completa atualiza seu recorte sem duplicar resultados ou alterar outros meses, incluindo registros que deixaram de constar no novo retrato.
- Falha/incompletude mantém a última base publicada e sua data visível.
- Cada recorte publicado é rastreável ao arquivo e à execução.
- Páginas/interações prioritárias conferidas visualmente com referências renderizadas; JSON sozinho não comprova fidelidade final.

PENDÊNCIAS
Matriz de perfis/carteiras; horários/SLA de carga; retenção; responsáveis pelo 518/cadastros; páginas legadas em uso; conciliação; orçamento e usuários simultâneos. Validar divergências já encontradas: gráfico Cabines intitulado Bilhetes usando XR Vendas, campos de origem divergentes no Terrestre e classificação diferente em Operadora/Grupos. Não corrigir nem copiar divergências sem decisão registrada.

FORA DO ESCOPO INICIAL
Reescrever RPAs atuais; presumir API do Wooffice; cobrança/assinaturas/Stripe; SaaS multiempresa; chat; Kanban; landing page comercial; agenda. Não alterar relatórios/fontes atuais durante a implementação sem autorização específica.

## 4. USER PERSONAS

Perfis propostos para validação com o cliente; não representam uma matriz já aprovada.

1. Administrador do cliente: gerencia usuários, perfis e escopos; acompanha cargas/auditoria e pode solicitar reprocessamento conforme permissão. Administração concedida explicitamente.

2. Gestor/direção: acompanha vendas, rentabilidade, metas, executivos, agências e produtos nos módulos/escopos autorizados; compara períodos e exporta quando permitido.

3. Executivo/comercial: consulta carteira ou recortes atribuídos, identifica agências inativas, oportunidades, metas e padrões de compra. Rentabilidade exige autorização específica. Carteira deve vir de regra cadastral homologada; não inferir acesso a partir de MAX(promotor_003) ou do nome exibido no BI.

4. Analista/leitor: navega por dashboards e filtros dentro do escopo; sem administração. Exportação e rentabilidade somente quando liberadas.

5. Identidade técnica de integração: credencial de servidor para importar/publicar lotes, com acesso mínimo necessário, sem uso interativo e sem segredos no navegador.

Público inicial: equipe autorizada da Pátria Consolidadora e áreas vinculadas aos relatórios. Não presumir acesso de clientes externos, agências ou empresas independentes sem confirmação. Quantidade de usuários e matriz final de módulos, filiais, agências e carteiras permanecem pendentes.

## 5. TECHNICAL STACK

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Supabase
- Vercel
- Claude Code
- PostgreSQL
- TypeScript

Arquitetura pretendida: Next.js + React + TypeScript na Vercel; Tailwind CSS e shadcn/ui para componentes. Supabase Postgres + Auth + RLS para dados, autenticação e autorização. Claude Code como ferramenta de desenvolvimento.

Novo importador Python na VPS já existente, reaproveitando CSV/Excel gerados pelos RPAs atuais. Os RPAs produtivos não serão movidos para a Vercel. Reutilizar o agendador atual, a identificar; n8n pode orquestrar se já estiver em uso. Contêineres podem ser avaliados sem presumir instalação existente. Carga via Postgres/API com identidade técnica restrita e segredos apenas no servidor. Publicação transacional da área intermediária. Não assumir upsert por linha.

As fontes, os arquivos correntes, históricos e os geradores estão detalhados na seção FONTES DE DADOS — ENDEREÇOS PARA IMPLEMENTAÇÃO, no campo Solução deste formulário.

DOCUMENTAÇÃO TÉCNICA PARA O COPILOTO
https://nextjs.org/docs
https://react.dev/learn
https://www.typescriptlang.org/docs/
https://tailwindcss.com/docs
https://ui.shadcn.com/docs
https://supabase.com/docs
https://supabase.com/docs/guides/auth
https://supabase.com/docs/guides/database/postgres/row-level-security
https://supabase.com/docs/guides/database/connecting-to-postgres
https://www.postgresql.org/docs/current/tutorial-transactions.html
https://vercel.com/docs
https://www.selenium.dev/documentation/
https://docs.n8n.io/ (se aplicável ao agendador existente)

Escolher versões compatíveis e fixá-las na implementação. Biblioteca de gráficos/matrizes deve passar por protótipo de fidelidade e suporte a hierarquias/subtotais antes da escolha definitiva. Não adicionar Prisma, Stripe, tRPC ou provedor de e-mail sem necessidade aprovada. Não inserir credenciais reais, chaves ou dados pessoais em prompts ou arquivos públicos.

## 6. DESIGN LANGUAGE

A principal referência é o Power BI atual da Pátria. Preservar identidade visual, distribuição dos indicadores, títulos, formatos, filtros, navegação, tabelas/matrizes e interações aprovadas. Evoluções de UX devem manter familiaridade e ser registradas.

Padrões extraídos: roxo #5208A5, fundo rosado #FFE4E2, vermelho #C82727/#F20013 e laranja #F87F07; Verdana predominante. Capa vermelha com logotipo Pátria. A imagem atual menciona 2025; confirmar atualização desse texto. Páginas usuais: canvas 1920 x 800; xray: 1600 x 4700 com rolagem vertical. Barra de navegação por ícones, filtros, cartões, gráficos e matrizes. Usar os recursos originais disponíveis e autorizados.

REFERÊNCIAS OBRIGATÓRIAS PARA O COPILOTO

Projeto/documentação no Notion:
https://app.notion.com/p/41a457f870428192af10c35f65c0db3d
Diagnóstico e limites:
https://app.notion.com/p/41a457f870428159ba2ccd127ef44a72
Inventário Aéreo, com subpáginas DAX e Power Query:
https://app.notion.com/p/41a457f8704281bda5a9f96125103ed1
Inventário Terrestre:
https://app.notion.com/p/41a457f8704281edb77bc2b32ff71e50
Inventário Operadora:
https://app.notion.com/p/41a457f8704281058474da02b0f6a76c
Fontes, geradores e evidências:
https://app.notion.com/p/41a457f8704281328081da9819d49799

ARQUIVOS ORIGINAIS DOS RELATÓRIOS
E:\Pátria\Novo BI\AEREO_PATRIA
E:\Pátria\Novo BI\TERRESTRE_PATRIA
E:\Pátria\Novo BI\OPERADORA PÁTRIA
Consultar os projetos .pbip, os arquivos .pbix/.pbit, .Report\definition (páginas/visuais), .Report\StaticResources (imagens/tema) e .SemanticModel\definition (DAX, Power Query e relações). Não modificar esses originais como parte da criação da aplicação.

MATERIAIS COMPLETOS DA INSPEÇÃO
C:\Users\MAURICIO SANTOS\Documents\Codex\2026-11-16\referenced-chatgpt-conversation-this-is-an\outputs
Arquivos: analise_dos_relatorios.md, inventario_power_bi.json, medidas_dax.md, mapa_dos_layouts.html e mapeamento_fontes_e_geradores.md.

O mapa HTML é uma reconstrução de posições, não uma captura real dos gráficos. A renderização com dados e as interações precisam de conferência no Power BI. Os links dos relatórios publicados no Power BI Service ainda não foram fornecidos: obter essas referências para homologação. O acesso do copiloto ao Notion, arquivos locais e compartilhamento depende de permissões/conectividade do seu ambiente. Nunca inventar links ou presumir que um endereço privado esteja público.

## 7. PROCESS

- Break app build into logical milestones (steps)
- Each milestone should be a deliverable increment
- Prioritize core functionality first, then iterate
- Test each milestone before moving to the next
