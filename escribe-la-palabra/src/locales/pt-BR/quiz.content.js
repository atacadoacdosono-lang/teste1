// ─────────────────────────────────────────────────────────────
// QUIZ DE ENTRADA DO FUNIL — BRASIL (br/index.html)
// Edite aqui textos, perguntas, pontos, tags e rotas. Depois: node build.mjs
//
// Cada opção tem:
//   value  → valor salvo e enviado ao CRM (mantido igual ao do México para relatórios unificados)
//   score  → pontos para qualificar o lead (soma → quente / morno / frio)
//   tags   → etiquetas enviadas ao CRM (segmentação / automações)
//   route  → (opcional) produto do ecossistema recomendado primeiro
// ─────────────────────────────────────────────────────────────

export const quiz = {
  seo: {
    title: "Quiz: Qual plano de escrita seu filho precisa? — Escreva a Palavra",
    description:
      "Responda 5 perguntas em 1 minuto e receba uma recomendação personalizada para treinar a letra em casa com versículos da Bíblia.",
  },

  intro: {
    pill: "Quiz gratuito · 1 minuto",
    title: 'Qual plano de escrita <mark class="hl hl--yellow">seu filho precisa</mark>?',
    subtitle:
      "Responda 5 perguntas rápidas e receba uma recomendação personalizada para treinar a letra em casa, com versículos da Bíblia, em poucos minutos por dia.",
    cta: "COMEÇAR O QUIZ",
    bullets: ["5 perguntas", "1 minuto", "Grátis"],
    sticker: "5 perguntas ✦ 1 min",
    image: {
      base: "../assets/img/familia-escribiendo",
      width: 1400,
      height: 781,
      alt: "Mãe acompanha o filho enquanto ele pratica a escrita na mesa",
    },
  },

  progressLabel: "Pergunta {n} de {total}",
  backLabel: "Voltar",

  questions: [
    {
      id: "edad",
      title: "Qual a idade do seu filho ou filha?",
      hint: "Se tiver mais de um filho, pense no que mais precisa treinar.",
      options: [
        { value: "4-5", label: "4 a 5 anos", emoji: "🌱", score: 1, tags: ["edad_4_5"], route: "primerosTrazos", ageLabel: "4 a 5 anos" },
        { value: "6-7", label: "6 a 7 anos", emoji: "✏️", score: 3, tags: ["edad_6_7"], ageLabel: "6 a 7 anos" },
        { value: "8-10", label: "8 a 10 anos", emoji: "📖", score: 3, tags: ["edad_8_10"], ageLabel: "8 a 10 anos" },
        { value: "11+", label: "11 anos ou mais", emoji: "🎒", score: 1, tags: ["edad_11_mas"], route: "proverbios", ageLabel: "11 anos ou mais" },
      ],
    },
    {
      id: "letra",
      title: "Como está a letra dele hoje?",
      options: [
        { value: "aprendiendo", label: "Está aprendendo a traçar as letras", emoji: "🔤", score: 2, tags: ["letra_aprendiendo"] },
        { value: "desordenada", label: "Já escreve, mas a letra é bagunçada", emoji: "〰️", score: 3, tags: ["letra_desordenada"] },
        { value: "frustra", label: "Tem muita dificuldade e se frustra", emoji: "😣", score: 3, tags: ["letra_frustracion"] },
        { value: "bien", label: "Escreve bem, quero reforçar o hábito", emoji: "⭐", score: 1, tags: ["letra_bien"] },
      ],
    },
    {
      id: "reto",
      title: "Qual é o seu maior desafio hoje?",
      options: [
        { value: "pantallas", label: "Ele passa muito tempo nas telas", emoji: "📱", score: 2, tags: ["dolor_pantallas"] },
        { value: "motivacion", label: "Não quer treinar, fica entediado", emoji: "😴", score: 2, tags: ["dolor_motivacion"] },
        { value: "tiempo", label: "Não tenho tempo de preparar atividades", emoji: "⏰", score: 2, tags: ["dolor_tiempo"] },
        { value: "valores", label: "Quero que aprenda valores e a Bíblia", emoji: "💛", score: 3, tags: ["dolor_valores"] },
      ],
    },
    {
      id: "tiempo",
      title: "Quanto tempo por dia vocês conseguem dedicar?",
      options: [
        { value: "5-10", label: "5 a 10 minutos", emoji: "⏱️", score: 1, tags: ["tiempo_5_10"] },
        { value: "15", label: "Uns 15 minutos", emoji: "🕒", score: 3, tags: ["tiempo_15"] },
        { value: "20-30", label: "20 a 30 minutos", emoji: "📚", score: 3, tags: ["tiempo_20_30"] },
        { value: "fin-semana", label: "Só nos fins de semana", emoji: "📅", score: 1, tags: ["tiempo_fin_semana"] },
      ],
    },
    {
      id: "contexto",
      title: "Onde você usaria?",
      options: [
        { value: "casa", label: "Em casa, com meus filhos", emoji: "🏡", score: 3, tags: ["contexto_casa"] },
        { value: "homeschool", label: "Educação domiciliar (homeschooling)", emoji: "🧑‍🏫", score: 3, tags: ["contexto_homeschool"] },
        { value: "salon", label: "Em sala de aula", emoji: "🏫", score: 2, tags: ["contexto_salon", "b2b"], route: "grupos" },
        { value: "iglesia", label: "Escola Bíblica Dominical ou ministério infantil", emoji: "⛪", score: 2, tags: ["contexto_iglesia", "b2b"], route: "grupos" },
      ],
    },
  ],

  // Qualificação por pontos (máximo 15). As tags enviadas ao CRM usam os nomes em espanhol
  // (lead_caliente / lead_tibio / lead_frio) para manter um único padrão entre os países.
  scoring: {
    hot: 12,
    warm: 8,
  },

  lead: {
    title: "Pronto! Sua recomendação está quase lista",
    subtitle: "Para quem vamos preparar? Também vamos enviar ideias e atividades para treinar em casa.",
    fields: {
      parentName: { label: "Seu nome", placeholder: "Ex.: Mariana", required: true },
      childName: { label: "Nome do seu filho ou filha (opcional)", placeholder: "Ex.: Sofia", required: false },
      email: { label: "Seu e-mail", placeholder: "seu@email.com", required: true },
      whatsapp: { label: "WhatsApp (opcional)", placeholder: "Ex.: (11) 91234-5678", required: false },
    },
    consent: "Aceito receber informações do Escreva a Palavra por e-mail ou WhatsApp e li a",
    consentLink: "Política de Privacidade",
    button: "VER MINHA RECOMENDAÇÃO",
    privacy: "Usaremos seus dados apenas para enviar sua recomendação e informações do Escreva a Palavra (LGPD).",
    skip: "Prefiro ver o resultado sem deixar meus dados",
    allowSkip: false,
    errors: {
      required: "Preencha este campo.",
      email: "Confira seu e-mail: parece que falta alguma coisa.",
      consent: "Precisamos da sua autorização para enviar a recomendação.",
    },
  },

  loading: {
    title: "Preparando sua recomendação…",
    steps: ["Analisando a idade e o nível de escrita", "Ajustando o ritmo diário", "Escolhendo o foco ideal"],
  },

  result: {
    childFallback: "seu filho",
    eyebrow: "Seu resultado",
    title: "{padre}, este é o plano recomendado para {hijo}",
    titleNoParent: "Este é o plano recomendado para {hijo}",
    profileLabel: "Perfil de escrita",
    rhythmLabel: "Ritmo recomendado",
    focusLabel: "Foco principal",
    whyTitle: "Por que o Escreva a Palavra combina com {hijo}",
    disclaimer: "Recomendação orientativa, baseada nas suas respostas. Não é uma avaliação profissional.",

    profiles: {
      aprendiendo: { name: "Explorador das letras", text: "Está dando os primeiros passos: o traçado guiado vai dar segurança, letra por letra." },
      desordenada: { name: "Escritor em construção", text: "Já escreve; agora precisa de prática constante com linhas de apoio para organizar a letra." },
      frustra: { name: "Escritor que precisa de confiança", text: "Passos curtos e conquistas visíveis ajudam a treinar sem frustração." },
      bien: { name: "Escritor em crescimento", text: "Tem uma boa base: a escrita independente e a memorização vão manter a evolução." },
    },

    rhythms: {
      "5-10": "Comece com LEIA e TRACE (10 min) e acrescente um passo a cada semana.",
      "15": "O plano completo: 5 passos em 15 minutos por dia.",
      "20-30": "Os 5 passos (15 min) + folhas extras de caligrafia para continuar treinando.",
      "fin-semana": "Duas sessões de 30 minutos: sábado e domingo, em família.",
    },

    focus: {
      pantallas: "Uma atividade sem telas que vira rotina diária.",
      motivacion: "Calendário de 12 semanas e certificado para motivá-lo a terminar.",
      tiempo: "Tudo pronto para imprimir: zero preparação para você.",
      valores: "Um versículo dos Salmos para memorizar e conversar em família.",
    },

    reasons: {
      byAnswer: {
        "letra:aprendiendo": "Inclui traçado com letras pontilhadas para começar com segurança.",
        "letra:desordenada": "A cópia guiada sobre linhas de apoio ajuda a organizar o tamanho e o formato das letras.",
        "letra:frustra": "Cada sessão é curta e tem um passo claro: menos pressão, mais conquistas.",
        "letra:bien": "A escrita independente e a memorização trazem um desafio na medida certa.",
        "reto:pantallas": "É papel e lápis: 15 minutos longe das telas.",
        "reto:motivacion": "O calendário e o certificado de conclusão dão uma meta visível.",
        "reto:tiempo": "É só imprimir e começar; cada dia já vem organizado.",
        "reto:valores": "Cada semana trabalha um versículo dos Salmos com uma pergunta para conversar.",
        "contexto:homeschool": "Encaixa fácil na sua rotina de português em casa.",
      },
      general: ["Programa de 12 semanas, passo a passo.", "PDF para imprimir com acesso imediato."],
    },

    main: {
      product: "salmos",
      cta: "VER MEU PLANO RECOMENDADO",
      secondary: "Ir direto para o pagamento — R$ 47",
    },

    routeNotes: {
      primerosTrazos:
        "Para 4 a 5 anos estamos preparando o <strong>Primeiros Traços</strong>. Avisaremos quando estiver pronto. Enquanto isso, o Escreva a Palavra — Salmos pode ser usado com mais ajuda no traçado.",
      proverbios:
        "Para maiores de 10 anos estamos preparando o <strong>Escreva a Palavra — Provérbios</strong>. Avisaremos quando estiver pronto. Enquanto isso, Salmos funciona muito bem para reforçar a letra e a memorização.",
      grupos:
        "Vai usar com uma turma? Estamos preparando uma <strong>licença para escolas e igrejas</strong>. Entraremos em contato com os detalhes. Você pode começar hoje com o seu exemplar.",
    },
  },

  // Ecossistema / esteira de produtos. Os itens "soon" são EXEMPLOS: edite ou remova.
  products: {
    salmos: { name: "Escreva a Palavra — Salmos", status: "available", url: "salmos.html", price: "R$ 47" },
    primerosTrazos: { name: "Primeiros Traços (4 a 5 anos)", status: "soon" },
    proverbios: { name: "Escreva a Palavra — Provérbios (11+ anos)", status: "soon" },
    grupos: { name: "Licença para escolas e igrejas", status: "soon" },
  },
};
