# Deploy na VPS — Evolution API + Agente NexusHub

Este diretório sobe a Evolution API (WhatsApp) na sua VPS. O backend do
agente (pasta `../backend`) roda ao lado, na mesma máquina, e fala com a
Evolution API só por `localhost` — nada disso precisa ficar exposto pra
internet.

**Importante:** eu (Claude) não tenho como executar estes comandos por você
— este ambiente não faz conexão SSH pra fora. Os passos abaixo você roda no
seu terminal (`ssh root@187.127.25.153`) ou no Terminal do navegador do
hPanel da Hostinger.

## 1. Entrar na VPS e clonar o repositório

```bash
ssh root@187.127.25.153
git clone https://github.com/atacadoacdosono-lang/teste1.git
cd teste1/deploy
```

## 2. Configurar e subir a Evolution API

```bash
cp .env.example .env
nano .env   # preencha EVOLUTION_API_KEY e POSTGRES_PASSWORD com valores aleatórios
chmod +x setup-vps.sh
./setup-vps.sh
```

Isso instala o Docker (se precisar) e sobe 3 containers: `evolution-api`,
`evolution-postgres`, `evolution-redis`. Confirme que respondeu:

```bash
curl http://localhost:8080
```

## 3. Configurar e subir o backend do agente

```bash
cd ../backend
npm install --production
cp .env.example .env
nano .env
```

No `.env` do backend, use:
- `EVOLUTION_API_URL=http://localhost:8080`
- `EVOLUTION_API_KEY=` (o mesmo valor que você colocou em `deploy/.env`)
- `ANTHROPIC_API_KEY=` (da sua conta em console.anthropic.com)
- `WEBHOOK_SECRET=` (invente uma string aleatória)

Depois:

```bash
npm install -g pm2   # se ainda não tiver
pm2 start src/server.js --name nexushub-agent
pm2 save
```

## 4. Criar a instância do WhatsApp e escanear o QR code

A Evolution API fica só em `localhost:8080` por segurança — pra ver o QR
code no seu navegador, abra um túnel SSH a partir do **seu computador**
(não dentro da VPS):

```bash
ssh -L 8080:localhost:8080 root@187.127.25.153
```

Deixe esse terminal aberto e, no seu navegador, acesse:

```
http://localhost:8080/manager
```

Isso deve abrir o painel de gerenciamento da Evolution API (o caminho exato
pode variar conforme a versão — se `/manager` não abrir, confira a
documentação da versão instalada em doc.evolution-api.com). Crie uma
instância chamada `pratica-colchoes` e escaneie o QR code com o WhatsApp que
vai atender (Configurações → Aparelhos conectados → Conectar aparelho).

## 5. Apontar o webhook da instância pro backend

Ainda com o túnel aberto (ou direto na VPS, chamando localhost), configure o
webhook da instância pra avisar o backend de mensagens novas:

```bash
curl -X POST http://localhost:8080/webhook/set/pratica-colchoes \
  -H "apikey: SUA_EVOLUTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "url": "http://localhost:3000/webhook/evolution/pratica-colchoes?secret=SEU_WEBHOOK_SECRET",
      "events": ["MESSAGES_UPSERT"],
      "enabled": true
    }
  }'
```

**Aviso:** o formato exato desse endpoint (`/webhook/set/{instance}`, o
formato do corpo) segue a documentação pública da Evolution API v2 — a
mesma ressalva do `backend/README.md` vale aqui: confira contra a versão
real instalada. Se dar erro, me mande a mensagem de erro que eu ajusto.

## 6. Testar de verdade

Mande uma mensagem de teste pro número conectado, de outro celular, e
acompanhe se o backend responde:

```bash
pm2 logs nexushub-agent
```

## Segurança

- Depois que tudo estiver funcionando, **troque a senha root da VPS** (ou
  migre pra autenticação só por chave SSH e desative login por senha) —
  ela foi digitada em texto puro numa conversa de chat em algum momento
  deste processo.
- Nenhuma porta além da 22 (SSH) precisa ficar aberta pro público. Confirme
  isso no firewall da Hostinger (VPS → Firewall).
