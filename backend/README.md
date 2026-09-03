# Agente NexusHub — backend (Fase 1)

Serviço que liga o WhatsApp de um cliente ao Claude, pra rodar o Assistente de
Vendas de verdade. Esta é a Fase 1 do roadmap (piloto manual com 1 cliente):
simples de propósito, sem multi-tenant automatizado, sem persistência em
banco de dados ainda — o objetivo é validar que o agente funciona na prática
antes de construir a estrutura completa (Fase 2 em diante).

## O que já funciona

- Recebe mensagens de WhatsApp via webhook da Evolution API
- Responde usando Claude, com base no catálogo e nas políticas do cliente
- Mantém o histórico da conversa por contato (em memória, dura enquanto o processo roda)
- Encaminha para atendimento humano quando o cliente pede ou usa palavras-chave configuradas
- Manda a foto de um produto junto com a resposta, quando o produto perguntado
  tem `photoUrl` cadastrado (veja "Fotos de produto" abaixo)

## O que ainda não existe (de propósito, é Fase 1)

- Banco de dados — histórico se perde ao reiniciar o processo
- Painel para o cliente editar o próprio catálogo — hoje é um arquivo JSON
- Suporte a múltiplos clientes rodando ao mesmo tempo sem risco de mistura de configuração
- Cobrança / checkout automático

## Pré-requisitos

1. **Uma instância da Evolution API rodando** (self-hosted, você escolheu essa opção).
   Este projeto **não hospeda** a Evolution API — só se conecta a ela. Suba a sua
   seguindo a documentação oficial: https://doc.evolution-api.com
2. **Uma chave de API da Anthropic** (Claude), em https://console.anthropic.com
   — é uma chave paga por uso, diferente do login do Claude.ai / Claude Code.
3. Node.js 18 ou mais recente.

## Configuração

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com:
- `EVOLUTION_API_URL` e `EVOLUTION_API_KEY` — da sua instância Evolution
- `ANTHROPIC_API_KEY` — da sua conta Anthropic
- `WEBHOOK_SECRET` — invente uma string aleatória; ela vai proteger o endpoint do webhook

## Configurar o cliente piloto

Cada cliente tem um arquivo em `config/clients/<clientId>.json` com o
catálogo, o tom de voz e as políticas do negócio dele. Já existe um exemplo
em `config/clients/ponto-certo.json` (o mesmo negócio fictício usado na
landing page) — **copie esse arquivo e edite com os dados reais do seu
cliente piloto** antes de ativar de verdade. É esse conteúdo que vira o
system prompt do Claude, então quanto mais completo (produtos, preços,
políticas de troca/entrega), melhor o agente responde.

## Rodando localmente

```bash
npm run dev
```

O servidor sobe em `http://localhost:3000`. Para a Evolution API (que roda em
outro lugar) conseguir alcançar seu webhook local durante os testes, exponha
a porta com um túnel, por exemplo [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

No painel da sua instância Evolution, configure o webhook de mensagens
recebidas (evento `messages.upsert`) apontando para:

```
https://SEU-TUNEL-OU-DOMINIO/webhook/evolution/ponto-certo?secret=SEU_WEBHOOK_SECRET
```

Troque `ponto-certo` pelo `clientId` do seu cliente piloto (o nome do
arquivo JSON, sem `.json`).

## Fotos de produto

Cada item do `catalog` no config do cliente pode ter um campo `photoUrl` com
um link direto pra imagem (hospedada em qualquer lugar público — site
próprio, Google Drive com link público, Instagram, etc.). Exemplo:

```json
{ "name": "Sonhos Real", "photoUrl": "https://exemplo.com/fotos/sonhos-real.jpg", "priceRange": "...", "details": "..." }
```

Quando o cliente pergunta sobre um produto que tem `photoUrl`, o agente manda
a foto (com a resposta como legenda) em vez de só texto — veja
`src/lib/catalogMatch.js`. Isso usa uma correspondência simples pelo nome do
produto na mensagem do cliente (sem sinônimos ou referências indiretas tipo
"aquele colchão que você mostrou") — funciona bem para a Fase 1, mas é um
heurístico, não a IA decidindo; uma tool call real do Claude escolhendo o
produto é uma melhoria natural pra Fase 2.

O envio de imagem em si (`sendImage` em `evolutionClient.js`) tem a mesma
ressalva do `sendText`: confira o endpoint contra a sua instância real antes
de produção.

## Aviso importante sobre a integração com a Evolution API

O código em `src/integrations/evolutionClient.js` foi escrito com base na
documentação pública da Evolution API v2 (endpoint `POST
/message/sendText/{instance}` para enviar, e o formato do evento
`messages.upsert` para receber). **Contratos de API self-hosted variam entre
versões** — antes de ativar com um cliente real, mande uma mensagem de teste
de verdade para a sua instância e confira no log do servidor (`console.log`
temporário em `parseIncomingMessage`, se precisar) se o formato bate. Se não
bater, ajuste esse arquivo — é o único lugar que depende do formato exato da
Evolution API.

## Deploy (Fase 1 — manual)

Para o piloto, rodar isso numa VPS simples (a mesma onde a Evolution API já
está, ou outra) com `pm2` ou um serviço `systemd` já é suficiente:

```bash
npm install --production
pm2 start src/server.js --name nexushub-agent
```

Aponte o webhook da Evolution API para o domínio/IP público dessa VPS. A
automação completa de deploy fica para a Fase 2, quando houver mais de um
cliente rodando.

## Próximos passos (fora do escopo desta fase)

- Fase 2: mover `conversationStore` para Postgres, um painel simples para
  editar `config/clients/*.json` sem mexer em código, deploy automatizado.
- Fase 3: checkout self-service (pagamento + criação de config de cliente
  automática) para o Assistente de WhatsApp, sem depender de call.
