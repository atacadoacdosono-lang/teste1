// Estructura del quiz (index.html). Las preguntas y el resultado los dibuja assets/js/quiz.js
// a partir de src/quiz.content.js. Los textos se editan en quiz.content.js.

import { icon, doodle } from "./icons.js";
import { Picture } from "./components.js";

const safeJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export const QuizPage = (q, { brand, site }) => `
  <main class="quiz" data-quiz>
    <header class="quiz__bar">
      <p class="quiz__brand">${icon("pencil")}${brand}</p>
      <div class="quiz__progress" data-progress hidden>
        <span class="quiz__progress-label" data-progress-label></span>
        <span class="quiz__progress-track"><span class="quiz__progress-fill" data-progress-fill></span></span>
      </div>
    </header>

    <!-- 1. Portada -->
    <section class="qscreen qscreen--intro" data-screen="intro" aria-labelledby="quiz-title">
      <span class="blob blob--sun" aria-hidden="true"></span>
      <span class="blob blob--sky" aria-hidden="true"></span>
      <span class="doodle doodle--star float" aria-hidden="true">${doodle("star")}</span>
      <span class="doodle doodle--pencil float" aria-hidden="true">${doodle("pencil")}</span>
      <div class="container qintro">
        <div class="qintro__copy">
          <p class="pill">${icon("sparkle")}${q.intro.pill}</p>
          <h1 class="h1" id="quiz-title">${q.intro.title}</h1>
          <p class="hero__sub">${q.intro.subtitle}</p>
          <button class="btn btn--sun qintro__cta" type="button" data-start>
            <span class="btn__label">${q.intro.cta}</span><span class="btn__arrow" aria-hidden="true">${icon("arrow")}</span>
          </button>
          <ul class="qintro__bullets" role="list">
            ${q.intro.bullets.map((b, i) => `<li class="chip chip--${["sky", "coral", "leaf"][i % 3]}">${icon("check")}${b}</li>`).join("")}
          </ul>
        </div>
        <figure class="qintro__media">
          <div class="hero__frame">${Picture(q.intro.image, { eager: true, cls: "qintro__img" })}</div>
          <span class="sticker sticker--1">${q.intro.sticker}</span>
        </figure>
      </div>
    </section>

    <!-- 2. Preguntas -->
    <section class="qscreen" data-screen="question" hidden aria-live="polite">
      <div class="container narrow qcard" data-question></div>
    </section>

    <!-- 3. Captura del lead -->
    <section class="qscreen" data-screen="lead" hidden aria-labelledby="lead-q-title">
      <div class="container narrow">
        <form class="qcard qlead" data-lead novalidate>
          <span class="qlead__badge" aria-hidden="true">${icon("gift")}</span>
          <h2 class="h2" id="lead-q-title">${q.lead.title}</h2>
          <p class="lead">${q.lead.subtitle}</p>
          <div class="qlead__fields">
            ${Object.entries(q.lead.fields)
              .map(
                ([key, f]) => `
            <div class="field">
              <label for="q-${key}">${f.label}</label>
              <input id="q-${key}" name="${key}" ${key === "email" ? 'type="email" inputmode="email" autocomplete="email"' : key === "whatsapp" ? 'type="tel" inputmode="tel" autocomplete="tel"' : 'type="text" autocomplete="' + (key === "parentName" ? "given-name" : "off") + '"'} placeholder="${f.placeholder}"${f.required ? " required" : ""} maxlength="80">
              <p class="field__error" data-error-for="${key}"></p>
            </div>`
              )
              .join("")}
            <div class="field field--check">
              <input id="q-consent" name="consent" type="checkbox" required>
              <label for="q-consent">${q.lead.consent} <a href="${site.legal.privacyUrl}" target="_blank" rel="noopener">${q.lead.consentLink}</a>.</label>
              <p class="field__error" data-error-for="consent"></p>
            </div>
          </div>
          <button class="btn btn--sun btn--block" type="submit">
            <span class="btn__label">${q.lead.button}</span><span class="btn__arrow" aria-hidden="true">${icon("arrow")}</span>
          </button>
          ${q.lead.allowSkip ? `<button class="qlead__skip" type="button" data-skip>${q.lead.skip}</button>` : ""}
          <p class="qlead__privacy">${icon("lock")}${q.lead.privacy}</p>
        </form>
      </div>
    </section>

    <!-- 4. Preparando resultado -->
    <section class="qscreen" data-screen="loading" hidden aria-live="polite">
      <div class="container narrow qcard qloading">
        <span class="qloading__spinner" aria-hidden="true">${doodle("pencil")}</span>
        <h2 class="h2">${q.loading.title}</h2>
        <ul class="qloading__steps" role="list">
          ${q.loading.steps.map((s) => `<li>${icon("check")}<span>${s}</span></li>`).join("")}
        </ul>
      </div>
    </section>

    <!-- 5. Resultado -->
    <section class="qscreen" data-screen="result" hidden aria-live="polite">
      <div class="container narrow" data-result></div>
    </section>
  </main>
  <script type="application/json" id="quiz-data">${safeJson({ quiz: q, locale: site.lang, currency: site.product.currency, webhookUrl: site.quiz.webhookUrl, landingPath: site.quiz.landingPath, passthroughParams: site.passthroughParams, checkoutUrl: site.checkoutUrl })}</script>`;
