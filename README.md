# NexusHub

Automação com IA para micro e pequenas empresas brasileiras — assistente de
vendas e atendimento pelo WhatsApp, com outros agentes (CRM, marketing,
financeiro, estoque) planejados no roadmap.

## Estrutura do repositório

- `backend/` — serviço que conecta o WhatsApp (via Evolution API) ao Claude
  para rodar o agente de verdade. Veja `backend/README.md` para como
  configurar e rodar. Estamos na Fase 1 do roadmap: piloto manual com um
  cliente, antes de automatizar onboarding e cobrança.
- `deploy/` — docker-compose e passo a passo para subir a Evolution API e o
  backend numa VPS de verdade. Veja `deploy/README.md`.

A landing page e o funil de vendas (quiz, captura de leads, planos) vivem
como Artifact publicado, fora deste repositório.
