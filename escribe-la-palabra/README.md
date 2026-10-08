# Escribe la Palabra — Landing page

Embudo mobile-first (español, México) para **Escribe la Palabra — Salmos**:

- `index.html` → **quiz** de 5 preguntas (página inicial, captura y calificación del lead). Ver [`FUNIL.md`](FUNIL.md).
- `salmos.html` → **página de venta** (se personaliza cuando la persona llega desde el quiz).
- `gracias.html` → página de gracias (evento Purchase).
Es un sitio estático: no necesita servidor ni dependencias. Se puede publicar en Vercel, Netlify, Hostinger, etc.

## Estructura

```
src/site.config.js   → checkout, precio, IDs de analítica, enlaces legales, SEO
src/content.js       → TODOS los textos de la página (editar aquí)
src/components.js    → componentes (Hero, Problem, Mechanism, Preview, Included, Bonuses,
                       Audience, Testimonials, Offer, Guarantee, Faq, LeadForm, FinalCta, StickyCta, Footer)
src/document.js      → <head>, SEO, Open Graph, Meta Pixel / GA4 / GTM
src/icons.js         → íconos SVG
src/quiz.content.js  → textos, preguntas, puntos, etiquetas y rutas del quiz
src/quiz.components.js → estructura del quiz
assets/js/quiz.js    → lógica del quiz (calificación, webhook, resultado)
build.mjs            → genera index.html (quiz), salmos.html y gracias.html
assets/css/styles.css→ estilos (colores y fuentes en :root)
assets/js/main.js    → eventos, checkout, CTA fijo en móvil, FAQ, formulario de lead
assets/img/          → imágenes (webp 800 / 1400)
```

Después de editar cualquier archivo de `src/`:

```bash
node build.mjs          # regenera index.html, salmos.html y gracias.html (Node 18+)
```

No edites los `.html` a mano: se sobrescribe en cada build.

## Antes de publicar (pendientes)

- [ ] `quiz.webhookUrl` (Make, Zapier, n8n, CRM) en `src/site.config.js` para recibir los leads del quiz.
- [ ] `checkoutUrl` real en `src/site.config.js` (mientras diga `TU-CHECKOUT`, los botones llevan a la oferta).
- [ ] IDs de analítica en `tracking` (`gtmId`, `ga4Id`, `metaPixelId`).
- [ ] `url` pública final del sitio (canonical y Open Graph).
- [ ] Aviso de privacidad, términos y correo de contacto (`legal`).
- [ ] Nombre de la plataforma de pago en `offer.secureNote` y reglas de uso para grupos (FAQ).
- [ ] Reemplazar imágenes ilustrativas por capturas/fotos reales del producto:
      `assets/img/preview-cuaderno-*.webp` y `assets/img/bono-tarjetas-versiculos-*.webp`
      (mismos nombres, 800 px y 1400 px de ancho). Las tarjetas actuales tienen texto de relleno.
- [ ] Video VSL: llena `vsl.src` en `src/content.js` y pon `vsl.showPlaceholder: false` (ver `MEDIA.md`).
- [ ] Testimonios: `testimonials.enabled` está en `false`. Actívalo solo con testimonios reales y autorizados.

## Imágenes y video

Guía completa de producción (tamaños, nombres de archivo, guion del VSL): [`MEDIA.md`](MEDIA.md).

## Eventos de analítica

| Evento            | Cuándo                                    | Meta Pixel        | GA4              | GTM (dataLayer)   |
|-------------------|-------------------------------------------|-------------------|------------------|-------------------|
| ViewContent       | Al cargar la landing                      | `ViewContent`     | `view_item`      | `ViewContent`     |
| InitiateCheckout  | Clic en botón que va al checkout          | `InitiateCheckout`| `begin_checkout` | `InitiateCheckout`|
| Lead              | Envío exitoso del formulario de correo    | `Lead`            | `generate_lead`  | `Lead`            |
| Purchase          | `gracias.html?transaction_id=…&value=…`   | `Purchase`        | `purchase`       | `Purchase`        |

- Cada evento lleva `event_id` (para deduplicar con la API de Conversiones).
- **Purchase**: configura la plataforma de pago para redirigir a `gracias.html?transaction_id={ID}&value={MONTO}`.
  Se dispara una sola vez por transacción. Si tu plataforma ya envía Purchase por integración nativa/CAPI,
  no uses esta redirección con parámetros para no duplicar compras.
- **GTM**: si usas GTM para GA4 y el Píxel, deja `ga4Id` y `metaPixelId` vacíos y crea activadores de
  "Evento personalizado" con los nombres de la tabla.
- Los parámetros UTM, `fbclid` y `gclid` se pasan automáticamente al checkout.
- **VideoPlay**: se envía al tocar play en el VSL (evento personalizado en Meta, `video_start` en GA4).
- **Lead**: el formulario solo aparece si configuras `leadForm.endpoint` (POST JSON `{ email, source }`).

## Ver en local

```bash
python3 -m http.server 4173   # luego abre http://localhost:4173
```
