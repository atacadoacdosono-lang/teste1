// Estructura del documento HTML: <head>, SEO y fragmentos de analítica.
import { site } from "./site.config.js";

const abs = (path) => new URL(path, site.url).href;

// Configuración disponible en el navegador para assets/js/main.js
const runtimeConfig = () =>
  JSON.stringify({
    product: site.product,
    checkoutUrl: site.checkoutUrl,
    passthroughParams: site.passthroughParams,
    leadEndpoint: site.leadForm.endpoint,
  });

const gtmHead = (id) =>
  id
    ? `
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');</script>
  <!-- End Google Tag Manager -->`
    : `
  <!-- Google Tag Manager: agrega tu ID en src/site.config.js (tracking.gtmId) -->`;

const gtmBody = (id) =>
  id
    ? `
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
    : "";

const ga4 = (id) =>
  id
    ? `
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');</script>`
    : `
  <!-- Google Analytics 4: agrega tu ID en src/site.config.js (tracking.ga4Id) -->`;

const metaPixel = (id) =>
  id
    ? `
  <!-- Meta Pixel -->
  <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');</script>
  <noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"></noscript>
  <!-- End Meta Pixel -->`
    : `
  <!-- Meta Pixel: agrega tu ID en src/site.config.js (tracking.metaPixelId) -->`;

export const Document = ({ title, description, path = "", body, page, robots = "index, follow", preload = "" }) => `<!doctype html>
<html lang="${site.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${abs(path)}">
  <meta name="theme-color" content="#FFF8EC">

  <meta property="og:type" content="product">
  <meta property="og:locale" content="${site.locale}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${abs(path)}">
  <meta property="og:image" content="${abs(site.ogImage)}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231B355C'/%3E%3Cpath d='M9 23l11-11 3 3-11 11H9z' fill='%23D9B45A'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800;900&family=Caveat:wght@700&family=Andika&display=swap">
  ${preload}
  <link rel="stylesheet" href="assets/css/styles.css">

  <script>window.SITE_CONFIG=${runtimeConfig()};window.dataLayer=window.dataLayer||[];</script>${gtmHead(site.tracking.gtmId)}${ga4(site.tracking.ga4Id)}${metaPixel(site.tracking.metaPixelId)}
</head>
<body data-page="${page}">${gtmBody(site.tracking.gtmId)}
${body}
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
