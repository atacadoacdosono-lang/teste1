const axios = require("axios");

const BASE_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;

function assertConfigured() {
  if (!BASE_URL || !API_KEY) {
    throw new Error(
      "EVOLUTION_API_URL e EVOLUTION_API_KEY precisam estar configurados no .env"
    );
  }
}

// Envia uma mensagem de texto simples pelo WhatsApp através da Evolution API.
//
// IMPORTANTE: o endpoint e o formato do corpo abaixo seguem a documentação
// pública da Evolution API v2 (POST /message/sendText/{instance}, header
// "apikey", body { number, text }). Contratos de API self-hosted variam entre
// versões — confira isso contra a documentação e uma chamada de teste real
// da SUA instância antes de colocar em produção.
async function sendText(instanceName, toNumber, text) {
  assertConfigured();
  const url = `${BASE_URL}/message/sendText/${instanceName}`;
  await axios.post(
    url,
    { number: toNumber, text },
    { headers: { apikey: API_KEY } }
  );
}

// Envia uma imagem (com legenda opcional) pelo WhatsApp através da Evolution API —
// usado quando o cliente pergunta sobre um produto que tem foto cadastrada.
//
// Mesma ressalva do sendText: endpoint e formato seguem a documentação pública
// da Evolution API v2 (POST /message/sendMedia/{instance}, body { number,
// mediatype, media, caption }). Confira contra a sua instância real antes de
// produção.
async function sendImage(instanceName, toNumber, imageUrl, caption) {
  assertConfigured();
  const url = `${BASE_URL}/message/sendMedia/${instanceName}`;
  await axios.post(
    url,
    { number: toNumber, mediatype: "image", media: imageUrl, caption: caption || "" },
    { headers: { apikey: API_KEY } }
  );
}

// Extrai remetente e texto de um evento de webhook "messages.upsert" da
// Evolution API. Retorna null quando o evento não é uma mensagem de texto
// recebida (mensagem enviada pelo próprio agente, mídia, outro tipo de evento).
//
// Mesma ressalva do sendText: valide esse parsing contra os payloads reais
// que a sua instância envia — em caso de divergência, ajuste aqui.
function parseIncomingMessage(webhookBody) {
  const data = webhookBody && webhookBody.data;
  if (!data || !data.key || data.key.fromMe) return null;

  const text =
    (data.message && data.message.conversation) ||
    (data.message &&
      data.message.extendedTextMessage &&
      data.message.extendedTextMessage.text);

  if (!text) return null;

  return {
    from: data.key.remoteJid,
    text,
  };
}

module.exports = { sendText, sendImage, parseIncomingMessage };
