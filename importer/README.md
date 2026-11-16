# importer/

Importador Python, executado na VPS existente, responsável por ler as saídas finais dos RPAs (Aéreo, Terrestre, Operadora/Grupos e cadastros auxiliares), validar e publicar retratos completos por fonte + período no Supabase.

## Propósito

- Ler os arquivos finais já usados pelo Power BI (`BI.xlsx` do Aéreo/Terrestre, `0021.csv` da Operadora/Grupos e cadastros auxiliares), sem alterar os fluxos/RPAs atuais.
- Validar arquivo, esquema, período, contagens e regras antes de qualquer publicação.
- Carregar em área intermediária (staging) e publicar em uma transação, substituindo apenas o recorte fonte + mês, preservando os demais períodos.
- Registrar auditoria por execução: origem, hash, período, versão das regras, início/fim, linhas lidas/publicadas/rejeitadas — sem segredos nem dados pessoais nos logs.

## Status

Implementação a partir do Milestone 10, após confirmação de acesso à VPS, caminhos locais e variante de RPA ativa (pendências registradas no PRD). Este diretório roda fora da Vercel; a Vercel não acessa o compartilhamento de arquivos.

Nenhuma credencial, caminho privado real ou dado pessoal deve ser commitado neste repositório.
