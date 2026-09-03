// Monta o system prompt do agente a partir da configuração de um cliente.
// Mantém a IA presa ao catálogo e às políticas reais do negócio, em vez de
// deixar ela inventar preço, prazo ou disponibilidade.
function formatBRL(value) {
  return value.toFixed(2).replace(".", ",");
}

function buildSystemPrompt(clientConfig) {
  const lines = [];

  lines.push(
    `Você é o agente de vendas e atendimento da ${clientConfig.businessName}, atendendo pelo WhatsApp.`
  );
  if (clientConfig.tone) lines.push(`Tom de voz: ${clientConfig.tone}`);

  lines.push("");
  lines.push("Regras gerais:");
  lines.push(
    "- Responda em português do Brasil, em mensagens curtas, no estilo de WhatsApp (poucas frases, sem parágrafos longos)."
  );
  lines.push(
    "- Use só as informações abaixo. Se não souber algo, diga que vai verificar e chamar alguém da equipe — nunca invente preço, prazo ou disponibilidade."
  );
  lines.push("- Não se apresente como IA a não ser que o cliente pergunte diretamente.");

  if (Array.isArray(clientConfig.catalog) && clientConfig.catalog.length) {
    lines.push("");
    lines.push("Catálogo:");
    clientConfig.catalog.forEach((item) => {
      const parts = [item.name];
      if (item.price != null) parts.push(`R$ ${formatBRL(item.price)}`);
      if (item.pixPrice != null) parts.push(`R$ ${formatBRL(item.pixPrice)} no Pix`);
      if (item.priceRange) parts.push(item.priceRange);
      if (item.variants) parts.push(`opções: ${item.variants.join(", ")}`);
      if (item.sizes) parts.push(`tamanhos: ${item.sizes.join(", ")}`);
      if (item.details) parts.push(item.details);
      lines.push(`- ${parts.join(" — ")}`);
    });
  }

  if (clientConfig.policies) {
    lines.push("");
    lines.push("Políticas:");
    Object.entries(clientConfig.policies).forEach(([key, value]) => {
      lines.push(`- ${key}: ${value}`);
    });
  }

  if (clientConfig.handoff && clientConfig.handoff.instructions) {
    lines.push("");
    lines.push(`Encaminhe para um atendente humano quando: ${clientConfig.handoff.instructions}`);
  } else if (clientConfig.handoff && clientConfig.handoff.triggerKeywords && clientConfig.handoff.triggerKeywords.length) {
    lines.push("");
    lines.push(
      `Se o cliente pedir para falar com um atendente humano, ou usar palavras como "${clientConfig.handoff.triggerKeywords.join('", "')}", avise que vai encaminhar para a equipe e pare de tentar resolver sozinho.`
    );
  }

  return lines.join("\n");
}

module.exports = { buildSystemPrompt };
