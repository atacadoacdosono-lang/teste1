# Funil de aquisição — Quiz → Lead → Oferta

```
Anúncio / orgânico
      │  (utm_*, fbclid, gclid)
      ▼
index.html — QUIZ (5 perguntas, 1 min)
      │  QuizStart · QuizAnswer (x5)
      ▼
Captura: nome, nome do filho (opc.), e-mail, WhatsApp (opc.), consentimento
      │  Lead (Meta/GA4) · QuizLead · POST → webhook do CRM
      ▼
Resultado personalizado (perfil, ritmo, foco, motivos)
      │  QuizComplete
      ├──► salmos.html?hijo=…&edad=…&from=quiz   (landing com "Plan recomendado para …")
      │        └─► checkout → gracias.html (Purchase)
      └──► checkout direto (InitiateCheckout)
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Perguntas, opções, pontos, tags, textos do resultado, produtos do ecossistema | `src/quiz.content.js` |
| Webhook do CRM e página de venda de destino | `src/site.config.js` → `quiz` |
| Visual | `assets/css/styles.css` (seção QUIZ) |
| Lógica | `assets/js/quiz.js` |

Depois de editar: `node build.mjs`.

## Dados enviados ao CRM (webhook)

POST com corpo JSON (header `Content-Type: text/plain` para evitar bloqueio CORS — no Make/Zapier/n8n use "parse JSON"):

```json
{
  "source": "quiz_escribe_la_palabra",
  "created_at": "2026-10-08T12:00:00.000Z",
  "parent_name": "Mariana López",
  "child_name": "Sofía",
  "email": "mariana@example.com",
  "whatsapp": "",
  "consent": true,
  "answers": { "edad": "6-7", "letra": "desordenada", "reto": "valores", "tiempo": "15", "contexto": "casa" },
  "score": 15,
  "temperature": "caliente",
  "tags": ["quiz_completado", "edad_6_7", "letra_desordenada", "dolor_valores", "tiempo_15", "contexto_casa", "lead_caliente"],
  "recommended_product": "salmos",
  "waitlist": [],
  "page": "https://…/index.html",
  "utm": { "utm_source": "fb" }
}
```

## Qualificação

Cada opção soma pontos (`score`). Total máximo: 15.

| Temperatura | Pontos | Sugestão de automação |
|---|---|---|
| `caliente` | 12–15 | E-mail/WhatsApp imediato com o link da oferta + lembrete em 24 h |
| `tibio` | 8–11 | Sequência de 3–5 e-mails de conteúdo (dicas de caligrafia) + oferta no 3º |
| `frio` | 0–7 | Nutrição mais longa; ofertas do ecossistema quando houver produto adequado |

## Escada de produtos (ecossistema)

Configurada em `quiz.products` e `result.routeNotes`. Hoje:

| Produto | Status | Quem é direcionado |
|---|---|---|
| Escribe la Palabra — Salmos | disponível | Todos (oferta principal) |
| Primeros Trazos (4–5 anos) | em breve | Idade 4–5 → tag `espera_primerosTrazos` |
| Escribe la Palabra — Proverbios (11+) | em breve | Idade 11+ → tag `espera_proverbios` |
| Licença para salas e igrejas | em breve | Contexto salão/igreja → tags `b2b`, `espera_grupos` |

Os produtos "em breve" são exemplos de esteira: edite os nomes, remova os que não existirem
ou mude `status` para `"available"` e adicione `url` quando forem lançados.
Não prometa datas que ainda não existem.

## Eventos de analítica do quiz

| Evento | Quando | Meta | GA4 |
|---|---|---|---|
| `QuizStart` | Clique em "Empezar el quiz" | custom | `quiz_start` |
| `QuizAnswer` | Cada resposta (`quiz_step`, `question`, `answer`) | custom | `quiz_answer` |
| `Lead` | Envio do formulário | **padrão** | `generate_lead` |
| `QuizLead` | Envio do formulário (`lead_score`, `lead_temperature`, `segment`) | custom | `quiz_lead` |
| `QuizComplete` | Resultado exibido | custom | `quiz_complete` |
| `QuizToLanding` | Clique em "Ver mi plan recomendado" | custom | `quiz_to_landing` |

Dica para Meta Ads: otimize campanhas de topo para `Lead` e crie públicos personalizados por `lead_temperature`.

## Privacidade (México)

O formulário exige consentimento e mostra o link do Aviso de privacidad (LFPDPPP).
Configure a URL real em `src/site.config.js` → `legal.privacyUrl` antes de publicar.
