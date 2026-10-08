// ─────────────────────────────────────────────────────────────
// QUIZ DE ENTRADA DEL EMBUDO (página inicial: index.html)
// Edita aquí textos, preguntas, puntos, etiquetas y rutas. Luego: node build.mjs
//
// Cada opción tiene:
//   value  → valor que se guarda y se envía al CRM
//   score  → puntos para calificar al lead (suma total → caliente / tibio / frío)
//   tags   → etiquetas que se envían al CRM (segmentación / automatizaciones)
//   route  → (opcional) producto del ecosistema que se recomienda primero
// ─────────────────────────────────────────────────────────────

export const quiz = {
  seo: {
    title: "Quiz: ¿Qué plan de escritura necesita tu hijo? — Escribe la Palabra",
    description:
      "Responde 5 preguntas en 1 minuto y recibe una recomendación personalizada para practicar la letra en casa con versículos de la Biblia.",
  },

  intro: {
    pill: "Quiz gratuito · 1 minuto",
    title: '¿Qué plan de escritura <mark class="hl hl--yellow">necesita tu hijo</mark>?',
    subtitle:
      "Responde 5 preguntas rápidas y recibe una recomendación personalizada para practicar la letra en casa, con versículos de la Biblia, en pocos minutos al día.",
    cta: "EMPEZAR EL QUIZ",
    bullets: ["5 preguntas", "1 minuto", "Gratis"],
    image: {
      base: "assets/img/familia-escribiendo",
      width: 1400,
      height: 781,
      alt: "Mamá acompaña a su hijo mientras practica escritura en la mesa",
    },
  },

  progressLabel: "Pregunta {n} de {total}",
  backLabel: "Atrás",

  questions: [
    {
      id: "edad",
      title: "¿Qué edad tiene tu hijo o hija?",
      hint: "Si tienes más de un hijo, piensa en el que más necesita practicar.",
      options: [
        { value: "4-5", label: "4 a 5 años", emoji: "🌱", score: 1, tags: ["edad_4_5"], route: "primerosTrazos", ageLabel: "4 a 5 años" },
        { value: "6-7", label: "6 a 7 años", emoji: "✏️", score: 3, tags: ["edad_6_7"], ageLabel: "6 a 7 años" },
        { value: "8-10", label: "8 a 10 años", emoji: "📖", score: 3, tags: ["edad_8_10"], ageLabel: "8 a 10 años" },
        { value: "11+", label: "11 años o más", emoji: "🎒", score: 1, tags: ["edad_11_mas"], route: "proverbios", ageLabel: "11 años o más" },
      ],
    },
    {
      id: "letra",
      title: "¿Cómo describirías su letra hoy?",
      options: [
        { value: "aprendiendo", label: "Está aprendiendo a trazar las letras", emoji: "🔤", score: 2, tags: ["letra_aprendiendo"] },
        { value: "desordenada", label: "Ya escribe, pero su letra es desordenada", emoji: "〰️", score: 3, tags: ["letra_desordenada"] },
        { value: "frustra", label: "Le cuesta mucho y se frustra", emoji: "😣", score: 3, tags: ["letra_frustracion"] },
        { value: "bien", label: "Escribe bien, quiero reforzar el hábito", emoji: "⭐", score: 1, tags: ["letra_bien"] },
      ],
    },
    {
      id: "reto",
      title: "¿Cuál es tu mayor reto hoy?",
      options: [
        { value: "pantallas", label: "Pasa mucho tiempo en pantallas", emoji: "📱", score: 2, tags: ["dolor_pantallas"] },
        { value: "motivacion", label: "No quiere practicar, se aburre", emoji: "😴", score: 2, tags: ["dolor_motivacion"] },
        { value: "tiempo", label: "No tengo tiempo de preparar actividades", emoji: "⏰", score: 2, tags: ["dolor_tiempo"] },
        { value: "valores", label: "Quiero que aprenda valores y la Biblia", emoji: "💛", score: 3, tags: ["dolor_valores"] },
      ],
    },
    {
      id: "tiempo",
      title: "¿Cuánto tiempo al día pueden dedicarle?",
      options: [
        { value: "5-10", label: "5 a 10 minutos", emoji: "⏱️", score: 1, tags: ["tiempo_5_10"] },
        { value: "15", label: "Unos 15 minutos", emoji: "🕒", score: 3, tags: ["tiempo_15"] },
        { value: "20-30", label: "20 a 30 minutos", emoji: "📚", score: 3, tags: ["tiempo_20_30"] },
        { value: "fin-semana", label: "Solo los fines de semana", emoji: "📅", score: 1, tags: ["tiempo_fin_semana"] },
      ],
    },
    {
      id: "contexto",
      title: "¿Dónde lo usarías?",
      options: [
        { value: "casa", label: "En casa, con mis hijos", emoji: "🏡", score: 3, tags: ["contexto_casa"] },
        { value: "homeschool", label: "Educación en casa (homeschool)", emoji: "🧑‍🏫", score: 3, tags: ["contexto_homeschool"] },
        { value: "salon", label: "En un salón de clases", emoji: "🏫", score: 2, tags: ["contexto_salon", "b2b"], route: "grupos" },
        { value: "iglesia", label: "Escuela dominical o ministerio infantil", emoji: "⛪", score: 2, tags: ["contexto_iglesia", "b2b"], route: "grupos" },
      ],
    },
  ],

  // Calificación por puntos (máximo 15)
  scoring: {
    hot: 12, // 12 o más → "caliente"
    warm: 8, // 8 a 11 → "tibio"; menos → "frío"
  },

  lead: {
    title: "¡Listo! Tu recomendación está casi lista",
    subtitle: "¿A quién se la preparamos? También te enviaremos ideas y actividades para practicar en casa.",
    fields: {
      parentName: { label: "Tu nombre", placeholder: "Ej. Mariana", required: true },
      childName: { label: "Nombre de tu hijo o hija (opcional)", placeholder: "Ej. Sofía", required: false },
      email: { label: "Tu correo electrónico", placeholder: "tu@correo.com", required: true },
      whatsapp: { label: "WhatsApp (opcional)", placeholder: "Ej. 55 1234 5678", required: false },
    },
    consent: "Acepto recibir información de Escribe la Palabra por correo o WhatsApp y he leído el",
    consentLink: "Aviso de privacidad",
    button: "VER MI RECOMENDACIÓN",
    privacy: "Usaremos tus datos solo para enviarte tu recomendación e información de Escribe la Palabra.",
    skip: "Prefiero ver el resultado sin dejar mis datos",
    allowSkip: false, // true = muestra el enlace para saltar la captura
    errors: {
      required: "Completa este campo.",
      email: "Revisa tu correo: parece que falta algo.",
      consent: "Necesitamos tu autorización para enviarte la recomendación.",
    },
  },

  loading: {
    title: "Preparando tu recomendación…",
    steps: ["Revisando la edad y el nivel de escritura", "Ajustando el ritmo diario", "Eligiendo el enfoque ideal"],
  },

  // ── Resultado ───────────────────────────────────────────
  // {padre}, {hijo}, {edad} se reemplazan con las respuestas. Si no hay nombre del hijo se usa childFallback.
  result: {
    childFallback: "tu hijo",
    eyebrow: "Tu resultado",
    title: "{padre}, este es el plan recomendado para {hijo}",
    titleNoParent: "Este es el plan recomendado para {hijo}",
    profileLabel: "Perfil de escritura",
    rhythmLabel: "Ritmo recomendado",
    focusLabel: "Enfoque principal",
    whyTitle: "Por qué Escribe la Palabra encaja con {hijo}",
    disclaimer: "Recomendación orientativa basada en tus respuestas. No es una evaluación profesional.",

    // Perfil según la pregunta "letra"
    profiles: {
      aprendiendo: { name: "Explorador de letras", text: "Está dando sus primeros pasos: el trazado guiado le dará seguridad letra por letra." },
      desordenada: { name: "Escritor en construcción", text: "Ya escribe; ahora necesita práctica constante con líneas guía para ordenar su letra." },
      frustra: { name: "Escritor que necesita confianza", text: "Pasos cortos y logros visibles le ayudarán a practicar sin frustrarse." },
      bien: { name: "Escritor en crecimiento", text: "Tiene buena base: la escritura independiente y la memorización lo mantendrán avanzando." },
    },

    // Ritmo según la pregunta "tiempo"
    rhythms: {
      "5-10": "Empieza con LEE y TRAZA (10 min) y suma un paso más cada semana.",
      "15": "El plan completo: 5 pasos en 15 minutos al día.",
      "20-30": "Los 5 pasos (15 min) + hojas extra de caligrafía para seguir practicando.",
      "fin-semana": "Dos sesiones de 30 minutos: sábado y domingo, en familia.",
    },

    // Enfoque según la pregunta "reto"
    focus: {
      pantallas: "Una actividad sin pantallas que se vuelve rutina diaria.",
      motivacion: "Calendario de 12 semanas y certificado para motivarlo a terminar.",
      tiempo: "Todo listo para imprimir: cero preparación para ti.",
      valores: "Un versículo de los Salmos para memorizar y conversar en familia.",
    },

    // Razones (se muestran las que coinciden con las respuestas + las generales)
    reasons: {
      byAnswer: {
        "letra:aprendiendo": "Incluye trazado con letras punteadas para empezar con seguridad.",
        "letra:desordenada": "La copia guiada sobre líneas guía ayuda a ordenar el tamaño y la forma de las letras.",
        "letra:frustra": "Cada sesión es corta y tiene un paso claro: menos presión, más logros.",
        "letra:bien": "La escritura independiente y la memorización le dan un reto a su medida.",
        "reto:pantallas": "Es papel y lápiz: 15 minutos lejos de las pantallas.",
        "reto:motivacion": "El calendario y el certificado de progreso le dan una meta visible.",
        "reto:tiempo": "Solo imprimes y empiezas; cada día ya está organizado.",
        "reto:valores": "Cada semana trabaja un versículo de los Salmos con una pregunta para conversar.",
        "contexto:homeschool": "Se integra fácil a tu rutina de lenguaje en casa.",
      },
      general: ["Programa de 12 semanas, paso a paso.", "PDF imprimible con acceso inmediato."],
    },

    // Producto principal recomendado
    main: {
      product: "salmos",
      cta: "VER MI PLAN RECOMENDADO",
      secondary: "Ir directo al pago — MX$149",
    },

    // Mensajes cuando la ruta apunta a otro producto del ecosistema
    routeNotes: {
      primerosTrazos:
        "Para los 4 a 5 años estamos preparando <strong>Primeros Trazos</strong>. Te avisaremos cuando esté listo. Mientras tanto, Escribe la Palabra — Salmos se puede usar con más acompañamiento en el trazado.",
      proverbios:
        "Para mayores de 10 años estamos preparando <strong>Escribe la Palabra — Proverbios</strong>. Te avisaremos cuando esté listo. Mientras tanto, Salmos funciona muy bien para reforzar la letra y la memorización.",
      grupos:
        "¿Lo usarás con un grupo? Estamos preparando una <strong>licencia para salones e iglesias</strong>. Te contactaremos con los detalles. Puedes empezar hoy con tu propio ejemplar.",
    },
  },

  // ── Ecosistema / escalera de productos ──────────────────
  // status: "available" (se vende hoy) o "soon" (lista de espera). Edita o agrega productos.
  products: {
    salmos: { name: "Escribe la Palabra — Salmos", status: "available", url: "salmos.html", price: "MX$149" },
    primerosTrazos: { name: "Primeros Trazos (4 a 5 años)", status: "soon" },
    proverbios: { name: "Escribe la Palabra — Proverbios (11+ años)", status: "soon" },
    grupos: { name: "Licencia para salones e iglesias", status: "soon" },
  },
};
