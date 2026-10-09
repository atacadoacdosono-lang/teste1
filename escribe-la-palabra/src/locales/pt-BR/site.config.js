// ─────────────────────────────────────────────────────────────
// Configuração técnica do site no Brasil (checkout, preço, analytics).
// Depois de editar, rode:  node build.mjs
// ─────────────────────────────────────────────────────────────

export const site = {
  url: "https://www.exemplo.com.br/br/", // URL pública final das páginas do Brasil (canonical / Open Graph)
  outDir: "br", // pasta onde as páginas em português são geradas
  assetPrefix: "../", // caminho até a pasta assets/ a partir das páginas
  pages: { quiz: "index.html", landing: "salmos.html", thanks: "obrigado.html" },
  lang: "pt-BR",
  locale: "pt_BR",
  ogImage: "../assets/img/familia-escribiendo-1400.webp",

  seo: {
    title: "Escreva a Palavra — Caderno de Caligrafia Bíblica para Crianças",
    description:
      "Programa para imprimir de 12 semanas para treinar a letra, memorizar versículos e refletir sobre a Palavra de Deus.",
  },

  product: {
    id: "escreva-a-palavra-salmos", // content_ids / item_id nos eventos
    name: "Escreva a Palavra — Salmos",
    category: "Produto digital / Material educativo para imprimir",
    price: 37.9,
    currency: "BRL",
  },

  // URL da página de pagamento (Hotmart, Kiwify, Eduzz, Ticto, Mercado Pago etc.).
  // Enquanto tiver "TU-CHECKOUT", os botões de compra levam para a seção da oferta
  // e mostram um aviso no console.
  checkoutUrl: "https://TU-CHECKOUT.com/escreva-a-palavra",

  // Parâmetros da URL atual repassados ao checkout (atribuição de campanhas).
  passthroughParams: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"],

  // Analytics: deixe o ID vazio ("") para não carregar a ferramenta.
  // Se usar o GTM para disparar GA4 e Pixel, deixe ga4Id e metaPixelId vazios para evitar eventos duplicados.
  tracking: {
    gtmId: "", // ej. "GTM-XXXXXXX"
    ga4Id: "", // ej. "G-XXXXXXXXXX"
    metaPixelId: "", // ej. "123456789012345"
  },

  // Formulário opcional de captura na página de venda (evento Lead). Fica oculto se endpoint estiver vazio.
  // O endpoint deve aceitar POST com JSON { email, source }.
  leadForm: {
    endpoint: "",
  },

  // Quiz (br/index.html): para onde vão os leads qualificados.
  // Webhook do Make, Zapier, n8n, RD Station, ActiveCampaign etc. Recebe POST com corpo JSON
  // (Content-Type text/plain para evitar bloqueio CORS). Vazio = não envia (só eventos de analytics).
  quiz: {
    webhookUrl: "",
    landingPath: "salmos.html", // página de venda para onde o resultado leva (igual a pages.landing)
  },

  legal: {
    privacyUrl: "#politica-de-privacidade", // substituir pela URL real da Política de Privacidade (LGPD)
    termsUrl: "#termos", // substituir pela URL real dos Termos de Uso
    contactEmail: "contato@exemplo.com.br",
  },
};
