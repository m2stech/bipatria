# supabase/

Infraestrutura de dados do BI Web Pátria: Postgres, Auth e RLS.

## Propósito

- `migrations/`: migrations SQL versionadas (schema, tabelas de staging/publicação, auditoria, RLS). Criadas a partir do Milestone 8.
- Políticas de RLS habilitadas em toda tabela exposta; negar por padrão.
- Estrutura que suporta retratos completos por fonte + período (sem upsert por linha), conforme [CLAUDE.md](../CLAUDE.md) e [docs/PRD.md](../docs/PRD.md).

## Status

Aguardando a URL do projeto Supabase (pendência registrada no PRD). Nenhuma credencial ou segredo deve ser adicionado a este diretório ou ao repositório.

Convenções: seguir a skill `supabase-postgres-best-practices` (tipos, chaves, índices, nomes em `snake_case` minúsculo, transações curtas).
