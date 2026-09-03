// Histórico de conversa por contato, em memória.
//
// Suficiente para a Fase 1 (piloto com 1 cliente): simples e sem dependências.
// Duas limitações a resolver na Fase 2, quando for pra produção com múltiplos
// clientes: (1) o histórico se perde a cada reinício do processo; (2) não
// escala além de uma única instância do servidor. Nessa fase, trocar este
// arquivo por uma tabela no Postgres/Redis, mantendo a mesma assinatura de
// getHistory/appendTurn, é a migração mais direta.

const MAX_TURNS = 20; // limita o crescimento do contexto enviado à Claude

const store = new Map();

function key(clientId, contact) {
  return `${clientId}:${contact}`;
}

function getHistory(clientId, contact) {
  return store.get(key(clientId, contact)) || [];
}

function appendTurn(clientId, contact, role, content) {
  const k = key(clientId, contact);
  const history = store.get(k) || [];
  history.push({ role, content });
  while (history.length > MAX_TURNS) history.shift();
  store.set(k, history);
}

module.exports = { getHistory, appendTurn };
