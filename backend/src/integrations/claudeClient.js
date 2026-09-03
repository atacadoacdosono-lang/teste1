const Anthropic = require("@anthropic-ai/sdk");

// Resolve a chave a partir de ANTHROPIC_API_KEY no ambiente — nunca deixe a
// chave hardcoded no código.
const client = new Anthropic();

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
const EFFORT = process.env.ANTHROPIC_EFFORT || "medium";

// Gera a resposta do agente para uma mensagem recebida, dado o system prompt
// do cliente (catálogo + políticas) e o histórico da conversa com esse contato.
async function generateReply(systemPrompt, history, userMessage) {
  const messages = [...history, { role: "user", content: userMessage }];

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      output_config: { effort: EFFORT },
      messages,
    });

    if (response.stop_reason === "refusal") {
      return "Desculpa, não consegui processar essa mensagem. Já vou chamar alguém da nossa equipe pra te ajudar.";
    }

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "";
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Chave da Anthropic inválida ou ausente:", error.message);
    } else if (error instanceof Anthropic.RateLimitError) {
      console.error("Limite de requisições da Anthropic atingido:", error.message);
    } else if (error instanceof Anthropic.APIError) {
      console.error(`Erro da API Anthropic (status ${error.status}):`, error.message);
    } else {
      console.error("Erro inesperado ao chamar a Anthropic:", error);
    }
    throw error;
  }
}

module.exports = { generateReply };
