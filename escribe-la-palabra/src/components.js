// Componentes de la página. Cada función recibe su bloque de content.js y devuelve HTML.
// Los textos NO se editan aquí: edítalos en content.js.

import { icon, doodle } from "./icons.js";
import { site } from "./site.js";

const list = (items, fn) => items.map(fn).join("");

// Colores que se alternan en tarjetas, pasos e íconos
const TONES = ["sky", "sun", "coral", "leaf", "grape"];
const tone = (i) => TONES[i % TONES.length];

const header = ({ eyebrow, title, subtitle }, id, { center = false } = {}) => `
      <header class="section-head${center ? " section-head--center" : ""}">
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
        <h2 class="h2"${id ? ` id="${id}"` : ""}>${title}</h2>
        ${subtitle ? `<p class="lead">${subtitle}</p>` : ""}
      </header>`;

export const Cta = ({ label, target }, { variant = "primary", location = "", block = false } = {}) => {
  const href = target === "checkout" ? site.checkoutUrl : "#oferta";
  const checkout = target === "checkout" ? " data-checkout" : "";
  return `<a class="btn btn--${variant}${block ? " btn--block" : ""}" href="${href}"${checkout} data-cta-location="${location}"><span class="btn__label">${label}</span><span class="btn__arrow" aria-hidden="true">${icon("arrow")}</span></a>`;
};

export const Picture = ({ base, width, height, alt }, { eager = false, sizes = "(min-width: 960px) 50vw, 100vw", cls = "" } = {}) => `
  <img${cls ? ` class="${cls}"` : ""} src="${base}-1400.webp" srcset="${base}-800.webp 800w, ${base}-1400.webp 1400w" sizes="${sizes}"
       width="${width}" height="${height}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

// Ondas entre secciones: color = color de la sección que empieza debajo
const Wave = (color, flip = false, on = "") => `
  <div class="wave wave--${color}${flip ? " wave--flip" : ""}${on ? ` wave--on-${on}` : ""}" aria-hidden="true">
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0 34c120-22 240-30 360-18s240 34 360 30 240-30 360-34 240 10 360 22v26H0z"/></svg>
  </div>`;

export const Vsl = (v, fallbackImage) => {
  const hasVideo = !!v.src;
  if (!hasVideo && !v.showPlaceholder) {
    return `<div class="hero__photo">${Picture(fallbackImage, { eager: true })}</div>`;
  }
  return `
    <div class="vsl${hasVideo ? "" : " vsl--placeholder"}" data-vsl data-type="${v.type}" data-src="${v.src}">
      ${Picture({ ...fallbackImage, base: v.poster, alt: "" }, { eager: true, cls: "vsl__poster" })}
      <span class="vsl__shade" aria-hidden="true"></span>
      <button class="vsl__play" type="button" aria-label="${v.playLabel}"${hasVideo ? "" : " disabled"}>
        <span class="vsl__ring" aria-hidden="true"></span>${icon("play")}
      </button>
      <span class="vsl__badge">${hasVideo ? v.badge : v.placeholder}</span>
    </div>`;
};

export const Hero = (c, vsl) => `
  <section class="hero" aria-labelledby="hero-title">
    <span class="blob blob--sun" aria-hidden="true"></span>
    <span class="blob blob--sky" aria-hidden="true"></span>
    <span class="doodle doodle--star float" aria-hidden="true">${doodle("star")}</span>
    <span class="doodle doodle--heart float float--slow" aria-hidden="true">${doodle("heart")}</span>
    <span class="doodle doodle--pencil float" aria-hidden="true">${doodle("pencil")}</span>
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="pill">${icon("sparkle")}${c.eyebrow}</p>
        <p class="personal" data-personal data-with-name="${c.personal.withName}" data-generic="${c.personal.generic}" hidden>${icon("check")}<span data-personal-text></span></p>
        <h1 class="h1" id="hero-title">${c.title}</h1>
        <p class="hero__sub">${c.subtitle}</p>
      </div>
      <div class="hero__media">
        <div class="hero__frame">
          ${Vsl(vsl, c.image)}
        </div>
        ${list(c.stickers, (s, i) => `<span class="sticker sticker--${i + 1}">${s}</span>`)}
      </div>
      <div class="hero__action">
        <div class="hero__cta" data-hero-cta>
          ${Cta(c.cta, { location: "hero", variant: "sun" })}
          <p class="micro">${icon("lock")}${c.microcopy}</p>
        </div>
        <ul class="chips" role="list">
          ${list(c.chips, (chip, i) => `<li class="chip chip--${tone(i)}">${icon("check")}${chip}</li>`)}
        </ul>
      </div>
    </div>
  </section>`;

export const Marquee = (words) => {
  const row = list(words, (w) => `<span>${w}</span><span class="marquee__dot" aria-hidden="true">✦</span>`);
  return `
  <div class="marquee-clip">
    <div class="marquee" role="img" aria-label="${words.join(", ")}">
      <div class="marquee__track" aria-hidden="true">${row}${row}</div>
    </div>
  </div>`;
};

export const Problem = (c) => `
  <section class="section" aria-labelledby="problem-title">
    <div class="container problem">
      <figure class="problem__media reveal">
        ${Picture(c.image, { sizes: "(min-width: 960px) 40vw, 100vw" })}
        <span class="tape tape--l" aria-hidden="true"></span><span class="tape tape--r" aria-hidden="true"></span>
      </figure>
      <div class="problem__copy">
        ${header(c, "problem-title")}
        ${list(c.paragraphs, (p) => `<p class="body">${p}</p>`)}
      </div>
    </div>
    <div class="container narrow">
      <ul class="pains" role="list">
        ${list(c.pains, (p) => `<li class="pain reveal"><span class="pain__icon">${icon("x")}</span><span>${p}</span></li>`)}
      </ul>
      <div class="bridge reveal">
        <span class="bridge__icon" aria-hidden="true">${icon("sparkle")}</span>
        <p>${c.bridge}</p>
      </div>
    </div>
  </section>`;

export const Mechanism = (c) => `
  ${Wave("sky")}
  <section class="section section--sky" aria-labelledby="mechanism-title">
    <span class="doodle doodle--star2 float" aria-hidden="true">${doodle("star")}</span>
    <div class="container">
      ${header(c, "mechanism-title", { center: true })}
      <ol class="steps" role="list">
        ${list(
          c.steps,
          (s, i) => `
          <li class="step step--${tone(i)} reveal">
            <span class="step__num" aria-hidden="true">${i + 1}</span>
            <span class="step__icon" aria-hidden="true">${icon(s.icon)}</span>
            <h3 class="step__word">${s.word}</h3>
            <p class="step__text">${s.text}</p>
          </li>`
        )}
      </ol>
      <div class="center">${Cta(c.cta, { location: "mechanism", variant: "sun" })}</div>
    </div>
  </section>
  ${Wave("sky", true)}`;

const PageMock = (p) => {
  const lines = (n) => Array.from({ length: n }, () => `<span class="ruled"></span>`).join("");
  const guide = (t) => `
      <svg class="trace" viewBox="0 0 300 52" aria-hidden="true">
        <line x1="0" y1="10" x2="300" y2="10" class="g"/><line x1="0" y1="27" x2="300" y2="27" class="g d"/><line x1="0" y1="44" x2="300" y2="44" class="g"/>
        <text x="4" y="42" class="dotted">${t}</text>
      </svg>`;
  let body = "";
  if (p.kind === "trace") body = `${guide(p.text)}${guide(p.text.split(" ")[0])}${lines(3)}`;
  else if (p.kind === "copy") body = `<p class="mock__model">${p.text}</p>${lines(5)}`;
  else body = `<p class="mock__question">${p.text}</p>${lines(3)}<span class="mock__draw">${icon("heart")}</span>`;
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
      ${header(c, "preview-title", { center: true })}
      <!-- REEMPLAZAR: imagen principal por una captura/mockup real del PDF -->
      <figure class="preview__main reveal" data-placeholder="mockup-pdf">
        ${Picture(c.image, { sizes: "(min-width: 960px) 900px, 100vw" })}
        <span class="tape tape--l" aria-hidden="true"></span><span class="tape tape--r" aria-hidden="true"></span>
      </figure>
      <div class="mocks" role="list">
        ${list(c.pages, (p, i) => `<div role="listitem" class="mocks__item mocks__item--${tone(i)}">${PageMock(p)}</div>`)}
      </div>
      <p class="caption">${c.caption}</p>
    </div>
  </section>`;

export const Included = (c) => `
  ${Wave("cream")}
  <section class="section section--cream" aria-labelledby="included-title">
    <div class="container">
      ${header(c, "included-title", { center: true })}
      <ul class="included" role="list">
        ${list(
          c.items,
          (it, i) => `
          <li class="included__item reveal">
            <span class="tick tick--${tone(i)}" aria-hidden="true">${icon("check")}</span>
            <div><h3 class="h4">${it.title}</h3><p>${it.text}</p></div>
          </li>`
        )}
      </ul>
    </div>
  </section>
  ${Wave("cream", true)}`;

export const Bonuses = (c) => `
  <section class="section" aria-labelledby="bonuses-title">
    <div class="container">
      ${header(c, "bonuses-title", { center: true })}
      <div class="bonuses">
        <!-- REEMPLAZAR: foto ilustrativa por fotos reales de los bonos -->
        <figure class="bonuses__media reveal" data-placeholder="foto-bonos">
          ${Picture(c.image, { sizes: "(min-width: 960px) 45vw, 100vw" })}
          <span class="burst" aria-hidden="true"><span>${c.sticker}</span></span>
          <figcaption class="caption">${c.illustrative}</figcaption>
        </figure>
        <ul class="bonus-list" role="list">
          ${list(
            c.items,
            (b, i) => `
            <li class="bonus bonus--${tone(i)} reveal">
              <span class="bonus__icon" aria-hidden="true">${icon(b.icon)}</span>
              <div>
                <p class="bonus__tag">${icon("gift")}${b.tag}</p>
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
  ${Wave("sun")}
  <section class="section section--sun" aria-labelledby="audience-title">
    <div class="container">
      ${header(c, "audience-title", { center: true })}
      <ul class="audience" role="list">
        ${list(
          c.items,
          (a, i) => `
          <li class="audience__item reveal">
            <span class="audience__icon audience__icon--${tone(i)}" aria-hidden="true">${icon(a.icon)}</span>
            <h3 class="h4">${a.title}</h3>
            <p>${a.text}</p>
          </li>`
        )}
      </ul>
      <p class="note">${c.note}</p>
    </div>
  </section>
  ${Wave("sun", true)}`;

export const Testimonials = (c) => {
  if (!c.enabled || !c.items.length) return "";
  return `
  <section class="section" aria-labelledby="testimonials-title">
    <div class="container">
      ${header(c, "testimonials-title", { center: true })}
      <ul class="testimonials" role="list">
        ${list(c.items, (t) => `<li class="testimonial"><blockquote>“${t.quote}”</blockquote><p class="testimonial__author">${t.author}</p></li>`)}
      </ul>
    </div>
  </section>`;
};

export const Offer = (c, g) => `
  <section class="section offer-section" id="oferta" aria-labelledby="offer-title">
    <span class="confetti" aria-hidden="true"></span>
    <div class="container narrow">
      ${header(c, "offer-title", { center: true })}
      <div class="offer" data-offer>
        <p class="offer__ribbon">${c.priceLabel}</p>
        <p class="offer__product">${c.productName}</p>
        <ul class="offer__list" role="list">
          ${list(c.includes, (i, n) => `<li><span class="tick tick--sm tick--${tone(n)}">${icon("check")}</span><span>${i}</span></li>`)}
        </ul>
        <div class="offer__price">
          <p class="offer__amount">${c.price}</p>
          <svg class="offer__squiggle" viewBox="0 0 200 14" aria-hidden="true"><path d="M2 9c18-8 30 6 48 0s30-8 48 0 30 6 48 0 30-8 52 0"/></svg>
          <p class="offer__note">${c.priceNote}</p>
        </div>
        ${Cta(c.cta, { location: "offer", variant: "sun", block: true })}
        <p class="offer__secure">${icon("lock")}${c.secureNote}</p>
        <p class="offer__format">${c.format}</p>
      </div>
      ${Guarantee(g)}
    </div>
  </section>`;

export const Guarantee = (c) => `
      <aside class="guarantee reveal" aria-labelledby="guarantee-title">
        <span class="guarantee__seal" aria-hidden="true">
          <svg class="guarantee__ring" viewBox="0 0 100 100"><defs><path id="seal-path" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text textLength="232" lengthAdjust="spacing"><textPath href="#seal-path" textLength="232">${c.sealText}</textPath></text></svg>
          <span class="guarantee__days"><strong>7</strong><small>${c.sealDays}</small></span>
        </span>
        <div>
          <h3 class="h3" id="guarantee-title">${c.title}</h3>
          <p>${c.text}</p>
        </div>
      </aside>`;

export const Faq = (c) => `
  ${Wave("cream")}
  <section class="section section--cream" aria-labelledby="faq-title">
    <div class="container narrow">
      ${header(c, "faq-title", { center: true })}
      <div class="faq">
        ${list(
          c.items,
          (f, i) => `
        <details class="faq__item faq__item--${tone(i)}">
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
  <section class="section section--cream section--tight" aria-labelledby="lead-title">
    <div class="container narrow">
      <form class="lead-form" data-lead-form novalidate>
        <h2 class="h3" id="lead-title">${c.title}</h2>
        <p>${c.text}</p>
        <div class="lead__row">
          <label class="sr-only" for="lead-email">${c.emailLabel}</label>
          <input id="lead-email" name="email" type="email" inputmode="email" autocomplete="email" required placeholder="${c.placeholder}">
          <button class="btn btn--leaf" type="submit"><span class="btn__label">${c.button}</span></button>
        </div>
        <p class="lead__status" role="status" data-success="${c.success}" data-error="${c.error}"></p>
        <p class="lead__privacy">${c.privacy}</p>
      </form>
    </div>
  </section>`;
};

export const FinalCta = (c) => `
  ${Wave("blue", false, "cream")}
  <section class="final" aria-labelledby="final-title">
    <span class="doodle doodle--star3 float" aria-hidden="true">${doodle("star")}</span>
    <span class="doodle doodle--heart2 float float--slow" aria-hidden="true">${doodle("heart")}</span>
    <div class="container narrow center final__inner">
      <h2 class="h2" id="final-title">${c.title}</h2>
      <p class="final__text">${c.text}</p>
      ${Cta(c.cta, { location: "final", variant: "sun" })}
    </div>
  </section>`;

export const StickyCta = (c) => `
  <div class="sticky" data-sticky inert>
    ${Cta(c.cta, { location: "sticky", variant: "sun", block: true })}
  </div>`;

export const Footer = (c, legal, brand) => `
  <footer class="footer">
    <div class="container narrow">
      <p class="footer__brand">${icon("pencil")}${brand}</p>
      <p class="footer__links">
        <a href="${legal.privacyUrl}">${c.privacyLabel}</a> ·
        <a href="${legal.termsUrl}">${c.termsLabel}</a> ·
        <a href="mailto:${legal.contactEmail}">${legal.contactEmail}</a>
      </p>
      <p class="footer__disclaimer">${c.disclaimer}</p>
      <p class="footer__copy">© <span data-year>${new Date().getFullYear()}</span> ${brand}</p>
    </div>
  </footer>`;
