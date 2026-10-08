// ─────────────────────────────────────────────────────────────
// Configuración técnica del sitio (checkout, precio, analítica).
// Después de editar, ejecuta:  node build.mjs
// ─────────────────────────────────────────────────────────────

export const site = {
  url: "https://www.ejemplo.com/", // URL pública final (canonical / Open Graph)
  lang: "es-MX",
  locale: "es_MX",
  ogImage: "assets/img/familia-escribiendo-1400.webp",

  seo: {
    title: "Escribe la Palabra — Cuaderno de Caligrafía Bíblica para Niños",
    description:
      "Programa imprimible de 12 semanas para practicar escritura, memorizar versículos y reflexionar sobre la Palabra de Dios.",
  },

  product: {
    id: "escribe-la-palabra-salmos", // content_ids / item_id en los eventos
    name: "Escribe la Palabra — Salmos",
    category: "Producto digital / Material educativo imprimible",
    price: 149,
    currency: "MXN",
  },

  // URL de la página de pago (Hotmart, Mercado Pago, Stripe, Kiwify, etc.).
  // Mientras siga con "TU-CHECKOUT", los botones de compra llevan a la sección de oferta
  // y muestran una advertencia en la consola.
  checkoutUrl: "https://TU-CHECKOUT.com/escribe-la-palabra",

  // Parámetros de la URL actual que se pasan al checkout (atribución de campañas).
  passthroughParams: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"],

  // Analítica: deja el ID vacío ("") para no cargar esa herramienta.
  // Si usas GTM para disparar GA4 y el Píxel, deja ga4Id y metaPixelId vacíos para evitar eventos duplicados.
  tracking: {
    gtmId: "", // ej. "GTM-XXXXXXX"
    ga4Id: "", // ej. "G-XXXXXXXXXX"
    metaPixelId: "", // ej. "123456789012345"
  },

  // Formulario opcional de captura (evento Lead). Se oculta si endpoint está vacío.
  // El endpoint debe aceptar POST con JSON { email, source }.
  leadForm: {
    endpoint: "",
  },

  // Quiz (index.html): a dónde se envían los leads calificados.
  // Webhook de Make, Zapier, n8n, GoHighLevel, ActiveCampaign, etc. Recibe POST con cuerpo JSON
  // (Content-Type text/plain para evitar bloqueos CORS). Vacío = no se envía (solo eventos de analítica).
  quiz: {
    webhookUrl: "",
    landingPath: "salmos.html", // página de venta a la que lleva el resultado
  },

  legal: {
    privacyUrl: "#aviso-de-privacidad", // reemplazar con la URL real del aviso de privacidad
    termsUrl: "#terminos", // reemplazar con la URL real de términos y condiciones
    contactEmail: "contacto@ejemplo.com",
  },
};
