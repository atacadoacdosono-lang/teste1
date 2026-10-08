// Genera index.html y gracias.html a partir de src/.
// Uso:  node build.mjs
import { writeFileSync } from "node:fs";
import { site } from "./src/site.config.js";
import { content as c } from "./src/content.js";
import { Document } from "./src/document.js";
import * as UI from "./src/components.js";

const strip = (html) => html.replace(/<[^>]+>/g, "");

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
    url: site.url,
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

const home = Document({
  title: site.seo.title,
  description: site.seo.description,
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
  path: "gracias.html",
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

writeFileSync(new URL("./index.html", import.meta.url), home);
writeFileSync(new URL("./gracias.html", import.meta.url), thanks);
console.log("✔ index.html y gracias.html generados");
