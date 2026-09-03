require("dotenv").config();
const express = require("express");

const { loadClientConfig } = require("./config/clientConfig");
const { buildSystemPrompt } = require("./lib/promptBuilder");
const { getHistory, appendTurn } = require("./lib/conversationStore");
const { generateReply } = require("./integrations/claudeClient");
const { sendText, sendImage, parseIncomingMessage } = require("./integrations/evolutionClient");
const { findCatalogPhoto } = require("./lib/catalogMatch");

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Webhook da Evolution API para um cliente específico.
// Configure, no painel da sua instância Evolution, o webhook de mensagens
// apontando para: POST https://SEU_DOMINIO/webhook/evolution/:clientId?secret=SEU_SEGREDO
// onde :clientId é o nome do arquivo em config/clients/ (sem .json).
app.post("/webhook/evolution/:clientId", async (req, res) => {
  const { clientId } = req.params;

  if (process.env.WEBHOOK_SECRET && req.query.secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "webhook secret inválido" });
  }

  // Responde rápido para a Evolution API não reenviar o mesmo evento por timeout;
  // o processamento continua depois, de forma assíncrona.
  res.status(200).json({ received: true });

  try {
    const clientConfig = loadClientConfig(clientId);
    if (!clientConfig) {
      console.error(`Config não encontrada para o cliente "${clientId}"`);
      return;
    }

    const incoming = parseIncomingMessage(req.body);
    if (!incoming) return; // não é uma mensagem de texto recebida — ignora

    const systemPrompt = buildSystemPrompt(clientConfig);
    const history = getHistory(clientId, incoming.from);

    const reply = await generateReply(systemPrompt, history, incoming.text);
    if (!reply) return;

    appendTurn(clientId, incoming.from, "user", incoming.text);
    appendTurn(clientId, incoming.from, "assistant", reply);

    // Se o cliente perguntou sobre um produto que tem foto cadastrada, manda
    // a foto com a resposta como legenda; senão, manda só o texto normal.
    const photoMatch = findCatalogPhoto(clientConfig, incoming.text);
    if (photoMatch) {
      await sendImage(clientConfig.evolutionInstance, incoming.from, photoMatch.photoUrl, reply);
    } else {
      await sendText(clientConfig.evolutionInstance, incoming.from, reply);
    }
  } catch (error) {
    console.error("Erro ao processar mensagem recebida:", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Agente NexusHub rodando na porta ${PORT}`);
});
