// Componentes de la página. Cada función recibe su bloque de content.js y devuelve HTML.
// Los textos NO se editan aquí: edítalos en content.js.

import { icon } from "./icons.js";
import { site } from "./site.config.js";

const list = (items, fn) => items.map(fn).join("");

const header = ({ eyebrow, title, subtitle }, id) => `
      <header class="section-head">
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
        <h2 class="h2"${id ? ` id="${id}"` : ""}>${title}</h2>
        ${subtitle ? `<p class="lead">${subtitle}</p>` : ""}
      </header>`;

export const Cta = ({ label, target }, { variant = "primary", location = "" } = {}) => {
  const href = target === "checkout" ? site.checkoutUrl : "#oferta";
  const attrs = target === "checkout" ? ` data-checkout data-cta-location="${location}"` : ` data-cta-location="${location}"`;
  return `<a class="btn btn--${variant}" href="${href}"${attrs}>${label}<span class="btn__arrow" aria-hidden="true">→</span></a>`;
};

export const Picture = ({ base, width, height, alt }, { eager = false, sizes = "(min-width: 960px) 50vw, 100vw" } = {}) => `
  <img src="${base}-1400.webp" srcset="${base}-800.webp 800w, ${base}-1400.webp 1400w" sizes="${sizes}"
       width="${width}" height="${height}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

export const Hero = (c) => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="eyebrow">${c.eyebrow}</p>
        <h1 class="h1" id="hero-title">${c.title}</h1>
        <p class="hero__sub">${c.subtitle}</p>
        <div class="hero__cta" data-hero-cta>
          ${Cta(c.cta, { location: "hero" })}
          <p class="micro">${c.microcopy}</p>
        </div>
        <ul class="chips" role="list">
          ${list(c.chips, (chip) => `<li class="chip">${icon("check")}${chip}</li>`)}
        </ul>
      </div>
      <figure class="hero__media">
        ${Picture(c.image, { eager: true })}
      </figure>
    </div>
  </section>`;

export const Problem = (c) => `
  <section class="section" aria-labelledby="problem-title">
    <div class="container narrow">
      ${header(c, "problem-title")}
      ${list(c.paragraphs, (p) => `<p class="body">${p}</p>`)}
      <ul class="pains" role="list">
        ${list(c.pains, (p) => `<li class="pain">${icon("x")}<span>${p}</span></li>`)}
      </ul>
      <p class="bridge">${c.bridge}</p>
    </div>
  </section>`;

export const Mechanism = (c) => `
  <section class="section section--alt" aria-labelledby="mechanism-title">
    <div class="container">
      ${header(c, "mechanism-title")}
      <ol class="steps" role="list">
        ${list(
          c.steps,
          (s, i) => `
          <li class="step">
            <span class="step__num" aria-hidden="true">${i + 1}</span>
            <span class="step__icon" aria-hidden="true">${icon(s.icon)}</span>
            <h3 class="step__word">${s.word}</h3>
            <p class="step__text">${s.text}</p>
          </li>`
        )}
      </ol>
      <div class="center">${Cta(c.cta, { location: "mechanism" })}</div>
    </div>
  </section>`;

const PageMock = (p) => {
  const lines = (n) => Array.from({ length: n }, () => `<span class="ruled"></span>`).join("");
  let body = "";
  if (p.kind === "trace") {
    body = `
      <svg class="trace" viewBox="0 0 300 52" role="img" aria-label="${p.text} (letras punteadas para trazar)">
        <line x1="0" y1="10" x2="300" y2="10" class="g"/><line x1="0" y1="27" x2="300" y2="27" class="g d"/><line x1="0" y1="44" x2="300" y2="44" class="g"/>
        <text x="4" y="42" class="dotted">${p.text}</text>
      </svg>
      <svg class="trace" viewBox="0 0 300 52" aria-hidden="true">
        <line x1="0" y1="10" x2="300" y2="10" class="g"/><line x1="0" y1="27" x2="300" y2="27" class="g d"/><line x1="0" y1="44" x2="300" y2="44" class="g"/>
        <text x="4" y="42" class="dotted">${p.text.split(" ")[0]}</text>
      </svg>
      ${lines(3)}`;
  } else if (p.kind === "copy") {
    body = `
      <p class="mock__model">${p.text}</p>
      ${lines(5)}`;
  } else {
    body = `
      <p class="mock__question">${p.text}</p>
      ${lines(3)}
      <span class="mock__draw">${icon("heart")}</span>`;
  }
  return `
    <figure class="mock">
      <div class="mock__paper">
        <p class="mock__heading">${p.heading}</p>
        ${body}
      </div>
      <figcaption class="mock__label">${p.label}</figcaption>
    </figure>`;
};

export const Preview = (c) => `
  <section class="section" aria-labelledby="preview-title">
    <div class="container">
      ${header(c, "preview-title")}
      <!-- REEMPLAZAR: imagen principal por una captura/mockup real del PDF -->
      <figure class="preview__main" data-placeholder="mockup-pdf">
        ${Picture(c.image, { sizes: "(min-width: 960px) 900px, 100vw" })}
      </figure>
      <div class="mocks" role="list">
        ${list(c.pages, (p) => `<div role="listitem">${PageMock(p)}</div>`)}
      </div>
      <p class="caption">${c.caption}</p>
    </div>
  </section>`;

export const Included = (c) => `
  <section class="section section--alt" aria-labelledby="included-title">
    <div class="container">
      ${header(c, "included-title")}
      <ul class="included" role="list">
        ${list(
          c.items,
          (it) => `
          <li class="included__item">
            <span class="tick" aria-hidden="true">${icon("check")}</span>
            <div><h3 class="h4">${it.title}</h3><p>${it.text}</p></div>
          </li>`
        )}
      </ul>
    </div>
  </section>`;

export const Bonuses = (c) => `
  <section class="section" aria-labelledby="bonuses-title">
    <div class="container">
      ${header(c, "bonuses-title")}
      <div class="bonuses">
        <!-- REEMPLAZAR: foto ilustrativa por fotos reales de los bonos -->
        <figure class="bonuses__media" data-placeholder="foto-bonos">
          ${Picture(c.image, { sizes: "(min-width: 960px) 45vw, 100vw" })}
          <figcaption class="caption">Imagen ilustrativa.</figcaption>
        </figure>
        <ul class="bonus-list" role="list">
          ${list(
            c.items,
            (b) => `
            <li class="bonus">
              <span class="bonus__icon" aria-hidden="true">${icon(b.icon)}</span>
              <div>
                <p class="bonus__tag">${b.tag}</p>
                <h3 class="h4">${b.title}</h3>
                <p>${b.text}</p>
              </div>
            </li>`
          )}
        </ul>
      </div>
    </div>
  </section>`;

export const Audience = (c) => `
  <section class="section section--alt" aria-labelledby="audience-title">
    <div class="container">
      ${header(c, "audience-title")}
      <ul class="audience" role="list">
        ${list(
          c.items,
          (a) => `
          <li class="card audience__item">
            <span class="audience__icon" aria-hidden="true">${icon(a.icon)}</span>
            <h3 class="h4">${a.title}</h3>
            <p>${a.text}</p>
          </li>`
        )}
      </ul>
      <p class="note">${c.note}</p>
    </div>
  </section>`;

export const Testimonials = (c) => {
  if (!c.enabled || !c.items.length) return "";
  return `
  <section class="section" aria-labelledby="testimonials-title">
    <div class="container">
      ${header(c, "testimonials-title")}
      <ul class="testimonials" role="list">
        ${list(c.items, (t) => `<li class="card"><blockquote>“${t.quote}”</blockquote><p class="testimonial__author">${t.author}</p></li>`)}
      </ul>
    </div>
  </section>`;
};

export const Offer = (c, g) => `
  <section class="section offer-section" id="oferta" aria-labelledby="offer-title">
    <div class="container narrow">
      ${header(c, "offer-title")}
      <div class="offer" data-offer>
        <p class="offer__product">${c.productName}</p>
        <ul class="offer__list" role="list">
          ${list(c.includes, (i) => `<li>${icon("check")}<span>${i}</span></li>`)}
        </ul>
        <div class="offer__price">
          <p class="offer__label">${c.priceLabel}</p>
          <p class="offer__amount">${c.price}</p>
          <p class="offer__note">${c.priceNote}</p>
        </div>
        ${Cta(c.cta, { location: "offer", variant: "primary btn--block" })}
        <p class="offer__secure">${icon("lock")}${c.secureNote}</p>
        <p class="offer__format">${c.format}</p>
      </div>
      ${Guarantee(g)}
    </div>
  </section>`;

export const Guarantee = (c) => `
      <aside class="guarantee" aria-labelledby="guarantee-title">
        <span class="guarantee__seal" aria-hidden="true"><strong>7</strong><small>días</small></span>
        <div>
          <h3 class="h3" id="guarantee-title">${c.title}</h3>
          <p>${c.text}</p>
        </div>
      </aside>`;

export const Faq = (c) => `
  <section class="section section--alt" aria-labelledby="faq-title">
    <div class="container narrow">
      ${header(c, "faq-title")}
      <div class="faq">
        ${list(
          c.items,
          (f) => `
        <details class="faq__item">
          <summary>${f.q}<span class="faq__icon" aria-hidden="true"></span></summary>
          <p>${f.a}</p>
        </details>`
        )}
      </div>
    </div>
  </section>`;

export const LeadForm = (c, endpoint) => {
  if (!endpoint) return "";
  return `
  <section class="section section--tight" aria-labelledby="lead-title">
    <div class="container narrow">
      <form class="lead-form card" data-lead-form novalidate>
        <h2 class="h3" id="lead-title">${c.title}</h2>
        <p>${c.text}</p>
        <div class="lead__row">
          <label class="sr-only" for="lead-email">Correo electrónico</label>
          <input id="lead-email" name="email" type="email" inputmode="email" autocomplete="email" required placeholder="${c.placeholder}">
          <button class="btn btn--secondary" type="submit">${c.button}</button>
        </div>
        <p class="lead__status" role="status" data-success="${c.success}" data-error="${c.error}"></p>
        <p class="lead__privacy">${c.privacy}</p>
      </form>
    </div>
  </section>`;
};

export const FinalCta = (c) => `
  <section class="final" aria-labelledby="final-title">
    <div class="container narrow center">
      <h2 class="h2" id="final-title">${c.title}</h2>
      <p class="final__text">${c.text}</p>
      ${Cta(c.cta, { location: "final", variant: "gold" })}
    </div>
  </section>`;

export const StickyCta = (c) => `
  <div class="sticky" data-sticky inert>
    ${Cta(c.cta, { location: "sticky", variant: "primary btn--block" })}
  </div>`;

export const Footer = (c, legal, brand) => `
  <footer class="footer">
    <div class="container narrow">
      <p class="footer__brand">${brand}</p>
      <p class="footer__links">
        <a href="${legal.privacyUrl}">${c.privacyLabel}</a> ·
        <a href="${legal.termsUrl}">${c.termsLabel}</a> ·
        <a href="mailto:${legal.contactEmail}">${legal.contactEmail}</a>
      </p>
      <p class="footer__disclaimer">${c.disclaimer}</p>
      <p class="footer__copy">© <span data-year>${new Date().getFullYear()}</span> ${brand}</p>
    </div>
  </footer>`;
