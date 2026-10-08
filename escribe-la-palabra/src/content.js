// ─────────────────────────────────────────────────────────────
// TODOS LOS TEXTOS DE LA PÁGINA.
// Edita aquí y ejecuta:  node build.mjs
// Se permite HTML básico dentro de los textos (<strong>, <em>, <br>).
//
// CTA "target":
//   "checkout" → va a la página de pago y dispara InitiateCheckout
//   "offer"    → baja a la sección de oferta (#oferta)
// ─────────────────────────────────────────────────────────────

export const content = {
  brand: "Escribe la Palabra",

  hero: {
    eyebrow: "Caligrafía bíblica · Niños de 6 a 10 años",
    title: 'Ayuda a tu hijo a <mark class="hl hl--yellow">mejorar su escritura</mark> mientras aprende <span class="scribble">la Palabra de Dios.</span>',
    subtitle:
      "Un programa de 12 semanas que combina caligrafía, escritura bíblica, memorización y reflexión en una actividad sencilla de solo 15 minutos al día.",
    cta: { label: "QUIERO ESCRIBIR LA PALABRA", target: "offer" },
    microcopy: "Pago único de MX$149 · Acceso digital inmediato",
    chips: ["PDF imprimible", "15 min al día", "12 semanas", "Sin pantallas"],
    stickers: ["¡Solo 15 min al día!", "PDF imprimible"],
    // Banner que aparece cuando la persona llega desde el quiz. {hijo} y {edad} se reemplazan.
    personal: {
      withName: "Plan recomendado para {hijo} · {edad}",
      generic: "Tu plan recomendado · {edad}",
    },
    image: {
      base: "assets/img/familia-escribiendo", // usa -800.webp y -1400.webp
      width: 1400,
      height: 781,
      alt: "Mamá acompaña a su hijo mientras practica escritura en la mesa de la casa",
    },
  },

  // VSL (video de ventas). Aparece en el hero en lugar de la foto.
  //   type: "youtube" (src = ID del video), "vimeo" (src = ID) o "mp4" (src = ruta/URL del archivo .mp4)
  //   Si src está vacío y showPlaceholder es true, se muestra un marcador "Tu video aquí" (solo para revisión).
  //   Antes de publicar: llena src o pon showPlaceholder en false (entonces se muestra la foto del hero).
  vsl: {
    type: "youtube",
    src: "",
    showPlaceholder: true,
    poster: "assets/img/familia-escribiendo", // portada del video (-800.webp / -1400.webp), ideal 16:9
    badge: "Mira cómo funciona · 2 min",
    playLabel: "Reproducir video",
    placeholder: "Aquí va tu video de ventas (VSL)",
  },

  marquee: ["LEE", "TRAZA", "COPIA", "ESCRIBE", "RECUERDA", "15 MINUTOS AL DÍA", "12 SEMANAS"],

  problem: {
    eyebrow: "El reto",
    title: 'Tu hijo necesita practicar su letra. Tú quieres que ese tiempo <mark class="hl hl--coral">valga la pena</mark>.',
    image: {
      base: "assets/img/familia-escribiendo",
      width: 1400,
      height: 781,
      alt: "Niño escribiendo en la mesa del comedor acompañado por su mamá",
    },
    paragraphs: [
      "La escritura a mano mejora con práctica constante: trazar, copiar y volver a escribir. Pero las planas repetitivas aburren rápido, y muchos niños terminan dejándolas a medias.",
      "Al mismo tiempo, encontrar actividades <strong>sin pantallas</strong> que sean fáciles de preparar, que tengan un propósito y que transmitan valores no siempre es sencillo, sobre todo con el poco tiempo que deja el día.",
    ],
    pains: [
      "Planas sin sentido que tu hijo no quiere terminar",
      "Demasiado tiempo frente al celular o la tablet",
      "Poco tiempo para buscar y preparar actividades",
      "Ganas de compartir valores en familia sin saber por dónde empezar",
    ],
    bridge:
      "<strong>Escribe la Palabra</strong> une las dos cosas: práctica de escritura con propósito, en una rutina breve que cabe en cualquier día.",
  },

  mechanism: {
    eyebrow: "Cómo funciona",
    title: 'Un método sencillo: <mark class="hl hl--yellow">5 pasos</mark>, 15 minutos al día',
    subtitle: "Cada semana tu hijo avanza poco a poco, del trazo guiado a la escritura independiente.",
    steps: [
      { word: "LEE", icon: "book", text: "Lee el versículo del día en voz alta, solo o acompañado." },
      { word: "TRAZA", icon: "trace", text: "Repasa letras y palabras sobre líneas guía punteadas." },
      { word: "COPIA", icon: "copy", text: "Copia el versículo con el modelo a la vista." },
      { word: "ESCRIBE", icon: "pencil", text: "Lo escribe por su cuenta, con su propia letra." },
      { word: "RECUERDA", icon: "heart", text: "Lo memoriza y reflexiona con una pregunta sencilla." },
    ],
    cta: { label: "QUIERO ESCRIBIR LA PALABRA", target: "offer" },
  },

  preview: {
    eyebrow: "Vista previa",
    title: "Así se ve por dentro",
    subtitle: "Hojas claras, con espacio amplio y líneas guía pensadas para manos pequeñas.",
    // REEMPLAZAR por capturas reales del PDF cuando estén disponibles.
    image: {
      base: "assets/img/preview-cuaderno",
      width: 1400,
      height: 1045,
      alt: "Cuaderno abierto con hojas de práctica de escritura y un versículo para trazar",
    },
    // Páginas de muestra dibujadas con CSS/SVG. Reemplazar por capturas reales si se desea.
    pages: [
      { label: "Paso 2 · Traza", kind: "trace", heading: "Traza las letras", text: "Mi pastor" },
      { label: "Paso 3 · Copia", kind: "copy", heading: "Copia el versículo", text: "El Señor es mi pastor; nada me faltará." },
      { label: "Paso 5 · Recuerda", kind: "reflect", heading: "Para pensar", text: "¿Cómo te cuida Dios hoy?" },
    ],
    caption: "Imágenes ilustrativas. El diseño final de las páginas puede variar.",
  },

  included: {
    eyebrow: "Contenido",
    title: "Todo lo que incluye el programa",
    items: [
      { title: "Programa de 12 semanas", text: "Una secuencia ordenada para avanzar semana a semana." },
      { title: "Ejercicios de caligrafía", text: "Práctica de letras y palabras con líneas guía." },
      { title: "Trazado", text: "Letras y palabras punteadas para repasar con calma." },
      { title: "Copia guiada", text: "El versículo con modelo para copiar debajo." },
      { title: "Escritura independiente", text: "Espacio para escribir sin apoyo y ver su avance." },
      { title: "Versículos de los Salmos", text: "Textos breves, adecuados para niños." },
      { title: "Memorización", text: "Actividades para guardar los versículos en la memoria." },
      { title: "Reflexión", text: "Preguntas sencillas para conversar en familia." },
      { title: "PDF imprimible", text: "Imprime en casa o en la papelería, cuando lo necesites." },
    ],
  },

  bonuses: {
    eyebrow: "Bonos incluidos",
    title: 'Además, recibes <mark class="hl hl--yellow">5 bonos</mark>',
    sticker: "+5 BONOS",
    // Imagen ilustrativa: REEMPLAZAR por foto real de las tarjetas.
    image: {
      base: "assets/img/bono-tarjetas-versiculos",
      width: 1400,
      height: 1045,
      alt: "Tarjetas ilustradas con versículos para memorizar sobre una mesa de madera",
    },
    items: [
      { tag: "Bono 1", title: "52 tarjetas de versículos", text: "Para recortar, memorizar y repasar durante todo el año.", icon: "cards" },
      { tag: "Bono 2", title: "Cuaderno de oración para niños", text: "Páginas para que tu hijo escriba y dibuje sus oraciones.", icon: "notebook" },
      { tag: "Bono 3", title: "Hojas extra de caligrafía", text: "Más práctica para cuando quiera seguir escribiendo.", icon: "pencil" },
      { tag: "Bono 4", title: "Calendario de 12 semanas", text: "Para marcar cada día completado y ver el avance.", icon: "calendar" },
      { tag: "Bono 5", title: "Certificado de progreso", text: "Para celebrar su esfuerzo al terminar el programa.", icon: "award" },
    ],
  },

  audience: {
    eyebrow: "¿Para quién es?",
    title: "Pensado para quienes acompañan a los niños",
    items: [
      { title: "Mamás y papás", text: "Que buscan una actividad con propósito y sin pantallas.", icon: "home" },
      { title: "Educación en casa", text: "Como parte de la rutina de lenguaje y escritura.", icon: "book" },
      { title: "Maestras y maestros", text: "Como apoyo para practicar escritura con valores.", icon: "apple" },
      { title: "Escuela dominical", text: "Para reforzar los versículos con una actividad práctica.", icon: "users" },
      { title: "Niños de 6 a 10 años", text: "Que están consolidando su letra y disfrutan aprender.", icon: "star" },
    ],
    note: "Es un material de práctica para casa. No sustituye la enseñanza escolar ni es un programa oficial de escritura.",
  },

  // Testimonios: desactivado hasta tener testimonios REALES y con autorización.
  // No inventes testimonios, reseñas ni número de clientes.
  testimonials: {
    enabled: false,
    eyebrow: "Opiniones",
    title: "Lo que dicen las familias",
    items: [
      // { quote: "Texto real del cliente.", author: "Nombre, Ciudad" },
    ],
  },

  offer: {
    eyebrow: "Oferta de lanzamiento",
    title: "Empieza hoy con Escribe la Palabra",
    productName: "Escribe la Palabra — Salmos",
    includes: [
      "Programa completo de 12 semanas",
      "Trazado, copia guiada y escritura independiente",
      "Versículos, memorización y reflexión",
      "52 tarjetas de versículos",
      "Cuaderno de oración para niños",
      "Hojas extra de caligrafía",
      "Calendario de 12 semanas",
      "Certificado de progreso",
    ],
    priceLabel: "Precio de lanzamiento",
    price: "MX$149",
    priceNote: "Pago único · Sin suscripciones · Acceso digital inmediato",
    cta: { label: "QUIERO EMPEZAR AHORA", target: "checkout" },
    secureNote: "El pago se procesa en una plataforma de pago segura.", // PLACEHOLDER: nombra la plataforma real
    format: "Producto digital (PDF). No se envía nada físico.",
  },

  guarantee: {
    title: "Garantía de 7 días",
    text: "Si el material no es lo que esperabas, puedes solicitar el reembolso dentro de los 7 días posteriores a tu compra, de acuerdo con los términos de la plataforma de pago.",
  },

  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Resolvemos tus dudas",
    items: [
      {
        q: "¿Para qué edad es?",
        a: "Está pensado para niños de 6 a 10 años. Los más pequeños pueden necesitar más acompañamiento en el trazado; los mayores pueden avanzar con más independencia.",
      },
      {
        q: "¿Es un libro físico?",
        a: "No. Es un producto digital en formato PDF. No se envía nada por paquetería: lo descargas y lo imprimes.",
      },
      {
        q: "¿Cómo lo imprimo?",
        a: "Puedes imprimirlo en casa con cualquier impresora o llevar el archivo a una papelería. También puedes imprimir solo las hojas que vayas a usar cada semana.",
      },
      {
        q: "¿Cuánto tiempo se necesita al día?",
        a: "Alrededor de 15 minutos. Puedes ajustar el ritmo a tu hijo: lo importante es la constancia, no la velocidad.",
      },
      {
        q: "¿Puedo usarlo con más de un hijo?",
        a: "Sí. Puedes imprimir las hojas para los niños de tu familia. Para usarlo con grupos o salones de clase, revisa los términos de uso.",
      },
      {
        q: "¿Cómo y cuándo lo recibo?",
        a: "El acceso es inmediato después de confirmar el pago: recibirás el enlace de descarga en el correo que registres al comprar. Si usas un método de pago que tarda en acreditarse, el acceso llega en cuanto se confirme.",
      },
      {
        q: "¿Tiene garantía?",
        a: "Sí. Tienes 7 días para solicitar el reembolso si el material no es lo que esperabas, de acuerdo con los términos de la plataforma de pago.",
      },
      {
        q: "¿Necesito pertenecer a alguna iglesia?",
        a: "No. Es un material de escritura basado en textos de los Salmos y lo puede usar cualquier familia o educador interesado.",
      },
    ],
  },

  lead: {
    title: "¿Aún lo estás pensando?",
    text: "Déjanos tu correo y te enviamos más información sobre el programa.",
    placeholder: "tu@correo.com",
    button: "ENVIARME INFORMACIÓN",
    success: "¡Listo! Revisa tu correo en unos minutos.",
    error: "No pudimos enviar tu correo. Intenta de nuevo.",
    privacy: "Usaremos tu correo solo para enviarte información de Escribe la Palabra.",
  },

  finalCta: {
    title: "Unos minutos hoy. Una práctica que puede acompañarlo durante mucho tiempo.",
    text: "Escribe la Palabra — Salmos · 12 semanas · PDF imprimible · MX$149 pago único",
    cta: { label: "QUIERO EMPEZAR AHORA", target: "checkout" },
  },

  sticky: {
    cta: { label: "QUIERO EMPEZAR — $149 MXN", target: "checkout" },
  },

  footer: {
    disclaimer:
      "Escribe la Palabra es un material educativo independiente. No está afiliado a ninguna iglesia, denominación ni editorial bíblica, y no es un programa educativo oficial. Este sitio no forma parte de Meta ni de Google.",
    privacyLabel: "Aviso de privacidad",
    termsLabel: "Términos y condiciones",
  },

  thankYou: {
    title: "¡Gracias por tu compra!",
    text: "En unos minutos recibirás en tu correo el enlace para descargar <strong>Escribe la Palabra — Salmos</strong>. Si no lo ves, revisa la carpeta de spam o promociones.",
    help: "¿Necesitas ayuda? Escríbenos a",
  },
};
