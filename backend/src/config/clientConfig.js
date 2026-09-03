const fs = require("fs");
const path = require("path");

const CLIENTS_DIR = path.join(__dirname, "..", "..", "config", "clients");
const cache = new Map();

// Carrega a configuração de um cliente (catálogo, tom de voz, políticas) do
// arquivo JSON correspondente em config/clients/<clientId>.json.
// Fica em memória depois da primeira leitura — reinicie o processo para
// pegar mudanças no arquivo durante o desenvolvimento.
function loadClientConfig(clientId) {
  if (cache.has(clientId)) return cache.get(clientId);

  const filePath = path.join(CLIENTS_DIR, `${clientId}.json`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const config = JSON.parse(raw);
  cache.set(clientId, config);
  return config;
}

module.exports = { loadClientConfig };
