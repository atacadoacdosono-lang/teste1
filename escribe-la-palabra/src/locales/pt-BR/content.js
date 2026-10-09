// ─────────────────────────────────────────────────────────────
// TODOS OS TEXTOS DA PÁGINA DE VENDA (Brasil).
// Edite aqui e rode:  node build.mjs
// É permitido HTML básico nos textos (<strong>, <em>, <br>).
//
// CTA "target":
//   "checkout" → vai para a página de pagamento e dispara InitiateCheckout
//   "offer"    → desce até a seção da oferta (#oferta)
//
// ─────────────────────────────────────────────────────────────

const IMG = "../assets/img"; // as páginas do Brasil ficam em /br/, as imagens em /assets/

export const content = {
  brand: "Escreva a Palavra",

  hero: {
    eyebrow: "Caligrafia bíblica · Crianças de 6 a 10 anos",
    title: 'Ajude seu filho a <mark class="hl hl--yellow">melhorar a letra</mark> enquanto aprende <span class="scribble">a Palavra de Deus.</span>',
    subtitle:
      "Um programa de 12 semanas que une caligrafia, escrita bíblica, memorização e reflexão em uma atividade simples de apenas 15 minutos por dia.",
    cta: { label: "QUERO ESCREVER A PALAVRA", target: "offer" },
    microcopy: "Pagamento único de R$ 37,90 · Acesso digital imediato",
    chips: ["PDF para imprimir", "15 min por dia", "12 semanas", "Sem telas"],
    stickers: ["Só 15 min por dia!", "PDF para imprimir"],
    // Faixa que aparece quando a pessoa chega pelo quiz. {hijo} e {edad} são substituídos.
    personal: {
      withName: "Plano recomendado para {hijo} · {edad}",
      generic: "Seu plano recomendado · {edad}",
    },
    image: {
      base: `${IMG}/familia-escribiendo`,
      width: 1400,
      height: 781,
      alt: "Mãe acompanha o filho enquanto ele pratica a escrita na mesa de casa",
    },
  },

  // VSL (vídeo de vendas). Aparece no topo no lugar da foto.
  //   type: "youtube" (src = ID do vídeo), "vimeo" (src = ID) ou "mp4" (src = caminho/URL do .mp4)
  //   Antes de publicar: preencha src ou coloque showPlaceholder: false (aí aparece a foto).
  vsl: {
    type: "youtube",
    src: "",
    showPlaceholder: true,
    poster: `${IMG}/familia-escribiendo`,
    badge: "Veja como funciona · 2 min",
    playLabel: "Assistir ao vídeo",
    placeholder: "Aqui entra o seu vídeo de vendas (VSL)",
  },

  marquee: ["LEIA", "TRACE", "COPIE", "ESCREVA", "LEMBRE", "15 MINUTOS POR DIA", "12 SEMANAS"],

  problem: {
    eyebrow: "O desafio",
    title: 'Seu filho precisa treinar a letra. Você quer que esse tempo <mark class="hl hl--coral">valha a pena</mark>.',
    image: {
      base: `${IMG}/familia-escribiendo`,
      width: 1400,
      height: 781,
      alt: "Menino escrevendo na mesa da sala, acompanhado pela mãe",
    },
    paragraphs: [
      "A letra melhora com prática constante: traçar, copiar e escrever de novo. Mas as folhas de cópia repetitivas cansam rápido, e muitas crianças acabam largando no meio.",
      "Ao mesmo tempo, encontrar atividades <strong>sem telas</strong> que sejam fáceis de preparar, tenham um propósito e transmitam valores nem sempre é simples, ainda mais com a correria do dia a dia.",
    ],
    pains: [
      "Cópias sem sentido que seu filho não quer terminar",
      "Tempo demais no celular ou no tablet",
      "Pouco tempo para procurar e preparar atividades",
      "Vontade de compartilhar valores em família sem saber por onde começar",
    ],
    bridge:
      "<strong>Escreva a Palavra</strong> une as duas coisas: prática de escrita com propósito, numa rotina curta que cabe em qualquer dia.",
  },

  mechanism: {
    eyebrow: "Como funciona",
    title: 'Um método simples: <mark class="hl hl--yellow">5 passos</mark>, 15 minutos por dia',
    subtitle: "A cada semana seu filho avança um pouco, do traçado guiado à escrita independente.",
    steps: [
      { word: "LEIA", icon: "book", text: "Lê o versículo do dia em voz alta, sozinho ou com você." },
      { word: "TRACE", icon: "trace", text: "Cobre letras e palavras sobre linhas pontilhadas." },
      { word: "COPIE", icon: "copy", text: "Copia o versículo com o modelo à vista." },
      { word: "ESCREVA", icon: "pencil", text: "Escreve sozinho, com a própria letra." },
      { word: "LEMBRE", icon: "heart", text: "Memoriza e reflete com uma pergunta simples." },
    ],
    cta: { label: "QUERO ESCREVER A PALAVRA", target: "offer" },
  },

  preview: {
    eyebrow: "Por dentro",
    title: "Veja como é por dentro",
    subtitle: "Folhas claras, com bastante espaço e linhas de apoio pensadas para mãos pequenas.",
    // SUBSTITUIR por fotos/prints reais do PDF em português.
    image: {
      base: `${IMG}/preview-cuaderno`,
      width: 1400,
      height: 1045,
      alt: "Caderno aberto com folhas de prática de escrita e um versículo para traçar",
    },
    pages: [
      { label: "Passo 2 · Trace", kind: "trace", heading: "Trace as letras", text: "Meu pastor" },
      { label: "Passo 3 · Copie", kind: "copy", heading: "Copie o versículo", text: "O Senhor é o meu pastor; nada me faltará." },
      { label: "Passo 5 · Lembre", kind: "reflect", heading: "Para pensar", text: "Como Deus cuida de você hoje?" },
    ],
    caption: "Imagens ilustrativas. O design final das páginas pode variar.",
  },

  included: {
    eyebrow: "Conteúdo",
    title: "Tudo o que vem no programa",
    items: [
      { title: "Programa de 12 semanas", text: "Uma sequência organizada para avançar semana a semana." },
      { title: "Exercícios de caligrafia", text: "Prática de letras e palavras com linhas de apoio." },
      { title: "Traçado", text: "Letras e palavras pontilhadas para cobrir com calma." },
      { title: "Cópia guiada", text: "O versículo com modelo para copiar logo abaixo." },
      { title: "Escrita independente", text: "Espaço para escrever sem apoio e ver a evolução." },
      { title: "Versículos dos Salmos", text: "Textos curtos, adequados para crianças." },
      { title: "Memorização", text: "Atividades para guardar os versículos no coração." },
      { title: "Reflexão", text: "Perguntas simples para conversar em família." },
      { title: "PDF para imprimir", text: "Imprima em casa ou na papelaria, quando precisar." },
    ],
  },

  bonuses: {
    eyebrow: "Bônus inclusos",
    title: 'E ainda leva <mark class="hl hl--yellow">5 bônus</mark>',
    sticker: "+5 BÔNUS",
    // Imagem ilustrativa: SUBSTITUIR por foto real dos cartões em português.
    image: {
      base: `${IMG}/bono-tarjetas-versiculos`,
      width: 1400,
      height: 1045,
      alt: "Cartões ilustrados com versículos para memorizar sobre uma mesa de madeira",
    },
    illustrative: "Imagem ilustrativa.",
    items: [
      { tag: "Bônus 1", title: "52 cartões de versículos", text: "Para recortar, memorizar e revisar o ano todo.", icon: "cards" },
      { tag: "Bônus 2", title: "Caderno de oração infantil", text: "Páginas para seu filho escrever e desenhar as orações dele.", icon: "notebook" },
      { tag: "Bônus 3", title: "Folhas extras de caligrafia", text: "Mais prática para quando ele quiser continuar escrevendo.", icon: "pencil" },
      { tag: "Bônus 4", title: "Calendário de 12 semanas", text: "Para marcar cada dia concluído e ver a evolução.", icon: "calendar" },
      { tag: "Bônus 5", title: "Certificado de conclusão", text: "Para celebrar o esforço ao terminar o programa.", icon: "award" },
    ],
  },

  audience: {
    eyebrow: "Para quem é?",
    title: "Pensado para quem acompanha as crianças",
    items: [
      { title: "Mães e pais", text: "Que buscam uma atividade com propósito e sem telas.", icon: "home" },
      { title: "Educação domiciliar", text: "Como parte da rotina de português e escrita.", icon: "book" },
      { title: "Professoras e professores", text: "Como apoio para treinar a escrita com valores.", icon: "apple" },
      { title: "Escola Bíblica Dominical", text: "Para fixar os versículos com uma atividade prática.", icon: "users" },
      { title: "Crianças de 6 a 10 anos", text: "Que estão firmando a letra e gostam de aprender.", icon: "star" },
    ],
    note: "É um material de prática para casa. Não substitui o ensino escolar nem é um programa oficial de alfabetização.",
  },

  // Depoimentos: desativado até ter depoimentos REAIS e autorizados.
  // Não invente depoimentos, avaliações nem número de clientes.
  testimonials: {
    enabled: false,
    eyebrow: "Depoimentos",
    title: "O que as famílias dizem",
    items: [
      // { quote: "Texto real do cliente.", author: "Nome, Cidade" },
    ],
  },

  offer: {
    eyebrow: "Oferta de lançamento",
    title: "Comece hoje com Escreva a Palavra",
    productName: "Escreva a Palavra — Salmos",
    includes: [
      "Programa completo de 12 semanas",
      "Traçado, cópia guiada e escrita independente",
      "Versículos, memorização e reflexão",
      "52 cartões de versículos",
      "Caderno de oração infantil",
      "Folhas extras de caligrafia",
      "Calendário de 12 semanas",
      "Certificado de conclusão",
    ],
    priceLabel: "Preço de lançamento",
    price: "R$ 37,90",
    priceNote: "Pagamento único · Sem mensalidade · Acesso digital imediato",
    cta: { label: "QUERO COMEÇAR AGORA", target: "checkout" },
    secureNote: "O pagamento é processado em uma plataforma de pagamento segura.", // PROVISÓRIO: cite a plataforma real
    format: "Produto digital (PDF). Nada é enviado pelo correio.",
  },

  guarantee: {
    sealText: "GARANTIA ✦ 7 DIAS ✦ GARANTIA ✦ 7 DIAS ✦",
    sealDays: "dias",
    title: "Garantia de 7 dias",
    text: "Se o material não for o que você esperava, você pode pedir o reembolso em até 7 dias após a compra, conforme os termos da plataforma de pagamento.",
  },

  faq: {
    eyebrow: "Perguntas frequentes",
    title: "Tire suas dúvidas",
    items: [
      {
        q: "Para qual idade é?",
        a: "Foi pensado para crianças de 6 a 10 anos. As menores podem precisar de mais ajuda no traçado; as maiores conseguem avançar com mais independência.",
      },
      {
        q: "É um livro físico?",
        a: "Não. É um produto digital em PDF. Nada é enviado pelo correio: você baixa e imprime.",
      },
      {
        q: "Como eu imprimo?",
        a: "Você pode imprimir em casa, em qualquer impressora, ou levar o arquivo a uma papelaria. Também dá para imprimir só as folhas da semana.",
      },
      {
        q: "Quanto tempo leva por dia?",
        a: "Cerca de 15 minutos. Você pode ajustar ao ritmo do seu filho: o importante é a constância, não a velocidade.",
      },
      {
        q: "Posso usar com mais de um filho?",
        a: "Sim. Você pode imprimir as folhas para as crianças da sua família. Para usar com turmas ou grupos, confira os termos de uso.",
      },
      {
        q: "Como e quando eu recebo?",
        a: "O acesso é imediato após a confirmação do pagamento: você recebe o link de download no e-mail cadastrado na compra. Se usar uma forma de pagamento que demora para compensar, o acesso chega assim que for confirmado.",
      },
      {
        q: "Tem garantia?",
        a: "Sim. Você tem 7 dias para pedir o reembolso se o material não for o que esperava, conforme os termos da plataforma de pagamento.",
      },
      {
        q: "Preciso fazer parte de alguma igreja?",
        a: "Não. É um material de escrita baseado em textos dos Salmos e pode ser usado por qualquer família ou educador interessado.",
      },
    ],
  },

  lead: {
    emailLabel: "E-mail",
    title: "Ainda está pensando?",
    text: "Deixe seu e-mail e enviamos mais informações sobre o programa.",
    placeholder: "seu@email.com",
    button: "QUERO RECEBER",
    success: "Pronto! Confira seu e-mail em alguns minutos.",
    error: "Não conseguimos enviar. Tente de novo.",
    privacy: "Usaremos seu e-mail apenas para enviar informações do Escreva a Palavra.",
  },

  finalCta: {
    title: "Alguns minutos hoje. Uma prática que pode acompanhá-lo por muito tempo.",
    text: "Escreva a Palavra — Salmos · 12 semanas · PDF para imprimir · R$ 37,90 pagamento único",
    cta: { label: "QUERO COMEÇAR AGORA", target: "checkout" },
  },

  sticky: {
    cta: { label: "QUERO COMEÇAR — R$ 37,90", target: "checkout" },
  },

  footer: {
    disclaimer:
      "Escreva a Palavra é um material educativo independente. Não tem vínculo com nenhuma igreja, denominação ou editora bíblica e não é um programa educacional oficial. Este site não faz parte da Meta nem do Google.",
    privacyLabel: "Política de Privacidade",
    termsLabel: "Termos de Uso",
  },

  thankYou: {
    title: "Obrigado pela sua compra!",
    text: "Em alguns minutos você vai receber no seu e-mail o link para baixar <strong>Escreva a Palavra — Salmos</strong>. Se não encontrar, confira a caixa de spam ou promoções.",
    help: "Precisa de ajuda? Escreva para",
  },
};
