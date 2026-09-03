function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Heurística simples (Fase 1): procura o nome de um produto do catálogo
// dentro da mensagem do cliente, para decidir se manda a foto daquele
// produto junto com a resposta.
//
// Limitação conhecida: só reconhece o nome exato do produto (ignorando
// acentos/maiúsculas) — não entende sinônimos, apelidos ou referências
// indiretas como "aquele colchão que você mostrou". Fase 2 pode trocar isso
// por uma tool call real do Claude, que escolhe o produto com mais contexto.
function findCatalogPhoto(clientConfig, userText) {
  if (!clientConfig || !Array.isArray(clientConfig.catalog)) return null;
  const normalizedText = normalize(userText);

  for (const item of clientConfig.catalog) {
    if (!item.photoUrl || !item.name) continue;
    if (normalizedText.indexOf(normalize(item.name)) !== -1) {
      return { name: item.name, photoUrl: item.photoUrl };
    }
  }
  return null;
}

module.exports = { findCatalogPhoto };
