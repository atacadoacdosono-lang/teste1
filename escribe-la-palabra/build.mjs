// Genera las páginas de cada idioma a partir de src/locales/<idioma>/:
//   es-MX → ./index.html (quiz), ./salmos.html (venta), ./gracias.html
//   pt-BR → ./br/index.html (quiz), ./br/salmos.html (venda), ./br/obrigado.html
// Uso:  node build.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { setSite } from "./src/site.js";
import { Document } from "./src/document.js";
import * as UI from "./src/components.js";
import { QuizPage } from "./src/quiz.components.js";

const LOCALES = ["es-MX", "pt-BR"];

const strip = (html) => html.replace(/<[^>]+>/g, "");

const buildLocale = async (locale) => {
  const { site } = await import(`./src/locales/${locale}/site.config.js`);
  const { content: c } = await import(`./src/locales/${locale}/content.js`);
  const { quiz } = await import(`./src/locales/${locale}/quiz.content.js`);
  setSite(site);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: site.product.name,
    description: site.seo.description,
    image: new URL(site.ogImage, site.url).href,
    category: site.product.category,
    offers: {
      "@type": "Offer",
      price: String(site.product.price),
      priceCurrency: site.product.currency,
      availability: "https://schema.org/InStock",
      url: new URL(site.pages.landing, site.url).href,
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: strip(f.a) },
    })),
  };

  const heroImg = c.hero.image.base;

  const landing = Document({
    title: site.seo.title,
    description: site.seo.description,
    path: site.pages.landing,
    page: "landing",
    preload: `<link rel="preload" as="image" href="${heroImg}-1400.webp" imagesrcset="${heroImg}-800.webp 800w, ${heroImg}-1400.webp 1400w" imagesizes="(min-width: 960px) 50vw, 100vw" fetchpriority="high">`,
    body: `
  <main>
    ${UI.Hero(c.hero, c.vsl)}
    ${UI.Marquee(c.marquee)}
    ${UI.Problem(c.problem)}
    ${UI.Mechanism(c.mechanism)}
    ${UI.Preview(c.preview)}
    ${UI.Included(c.included)}
    ${UI.Bonuses(c.bonuses)}
    ${UI.Audience(c.audience)}
    ${UI.Testimonials(c.testimonials)}
    ${UI.Offer(c.offer, c.guarantee)}
    ${UI.Faq(c.faq)}
    ${UI.LeadForm(c.lead, site.leadForm.endpoint)}
    ${UI.FinalCta(c.finalCta)}
  </main>
  ${UI.Footer(c.footer, site.legal, c.brand)}
  ${UI.StickyCta(c.sticky)}
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>`,
  });

  const thanks = Document({
    title: `${c.thankYou.title} — ${c.brand}`,
    description: site.seo.description,
    path: site.pages.thanks,
    page: "thankyou",
    robots: "noindex, nofollow",
    body: `
  <main class="thanks">
    <div class="container narrow center">
      <span class="thanks__icon" aria-hidden="true">✓</span>
      <h1 class="h1">${c.thankYou.title}</h1>
      <p class="lead">${c.thankYou.text}</p>
      <p class="note">${c.thankYou.help} <a href="mailto:${site.legal.contactEmail}">${site.legal.contactEmail}</a></p>
    </div>
  </main>
  ${UI.Footer(c.footer, site.legal, c.brand)}`,
  });

  const quizPage = Document({
    title: quiz.seo.title,
    description: quiz.seo.description,
    path: site.pages.quiz,
    page: "quiz",
    body: QuizPage(quiz, { brand: c.brand, site }),
    scripts: `\n  <script src="${site.assetPrefix}assets/js/quiz.js" defer></script>`,
  });

  const out = new URL(`./${site.outDir}/`, import.meta.url);
  mkdirSync(out, { recursive: true });
  writeFileSync(new URL(site.pages.quiz, out), quizPage);
  writeFileSync(new URL(site.pages.landing, out), landing);
  writeFileSync(new URL(site.pages.thanks, out), thanks);
  const dir = site.outDir === "." ? "" : `${site.outDir}/`;
  console.log(`✔ ${locale}: ${dir}${site.pages.quiz} (quiz) · ${dir}${site.pages.landing} (venta) · ${dir}${site.pages.thanks}`);
};

for (const locale of LOCALES) await buildLocale(locale);
