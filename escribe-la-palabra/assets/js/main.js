/* Escribe la Palabra — interacciones y eventos de analítica.
 * Eventos: ViewContent · InitiateCheckout · Lead · Purchase
 * Se envían a: Meta Pixel (fbq), GA4 (gtag) y GTM (dataLayer), solo si están cargados.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var product = cfg.product || {};
  var page = document.body.getAttribute("data-page");

  // ── Tracking ─────────────────────────────────────────────
  var GA4_NAMES = {
    ViewContent: "view_item",
    InitiateCheckout: "begin_checkout",
    Lead: "generate_lead",
    Purchase: "purchase",
  };

  function eventId(name) {
    return name + "." + Date.now() + "." + Math.random().toString(36).slice(2, 8);
  }

  function track(name, extra) {
    extra = extra || {};
    var value = extra.value != null ? extra.value : product.price;
    var currency = extra.currency || product.currency;
    var id = extra.event_id || eventId(name);

    var metaParams = {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: value,
      currency: currency,
    };
    if (extra.cta_location) metaParams.cta_location = extra.cta_location;

    var item = { item_id: product.id, item_name: product.name, price: value, quantity: 1 };
    var gaParams = { currency: currency, value: value, items: [item] };
    if (extra.transaction_id) gaParams.transaction_id = extra.transaction_id;
    if (extra.cta_location) gaParams.cta_location = extra.cta_location;

    try {
      if (typeof window.fbq === "function") window.fbq("track", name, metaParams, { eventID: id });
    } catch (e) {}
    try {
      if (typeof window.gtag === "function") window.gtag("event", GA4_NAMES[name], gaParams);
    } catch (e) {}

    // GTM: crea un activador de "Evento personalizado" con el nombre (ViewContent, InitiateCheckout, Lead, Purchase).
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: name,
      event_id: id,
      ga4_event: GA4_NAMES[name],
      cta_location: extra.cta_location,
      ecommerce: gaParams,
    });
  }
  window.ELP = { track: track };

  // ── Checkout ─────────────────────────────────────────────
  var checkoutReady = cfg.checkoutUrl && cfg.checkoutUrl.indexOf("TU-CHECKOUT") === -1;

  function checkoutHref() {
    var url = new URL(cfg.checkoutUrl);
    var current = new URLSearchParams(window.location.search);
    (cfg.passthroughParams || []).forEach(function (key) {
      if (current.has(key) && !url.searchParams.has(key)) url.searchParams.set(key, current.get(key));
    });
    return url.toString();
  }

  document.querySelectorAll("[data-checkout]").forEach(function (el) {
    if (checkoutReady) {
      el.href = checkoutHref();
    } else {
      el.href = "#oferta";
    }
    el.addEventListener("click", function () {
      if (!checkoutReady) {
        console.warn("[Escribe la Palabra] Configura checkoutUrl en src/site.config.js y ejecuta node build.mjs");
      }
      track("InitiateCheckout", { cta_location: el.getAttribute("data-cta-location") });
    });
  });

  // ── Sticky CTA (móvil) ───────────────────────────────────
  var sticky = document.querySelector("[data-sticky]");
  var heroCta = document.querySelector("[data-hero-cta]");
  var hideZones = document.querySelectorAll("[data-offer], .final");
  if (sticky && heroCta && "IntersectionObserver" in window) {
    var heroVisible = true;
    var zonesVisible = new Set();
    var update = function () {
      var show = !heroVisible && zonesVisible.size === 0;
      sticky.classList.toggle("is-visible", show);
      if (show) sticky.removeAttribute("inert");
      else sticky.setAttribute("inert", "");
    };
    new IntersectionObserver(function (entries) {
      // Visible mientras el botón del hero esté en pantalla o por debajo (todavía sin pasar)
      heroVisible = entries[0].isIntersecting || entries[0].boundingClientRect.top > 0;
      update();
    }).observe(heroCta);
    var zoneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) zonesVisible.add(e.target);
        else zonesVisible.delete(e.target);
      });
      update();
    });
    hideZones.forEach(function (z) { zoneObserver.observe(z); });
  }

  // ── VSL: carga el video solo al hacer clic (página más rápida) ──
  var vsl = document.querySelector("[data-vsl]");
  if (vsl && vsl.getAttribute("data-src")) {
    vsl.querySelector(".vsl__play").addEventListener("click", function () {
      var type = vsl.getAttribute("data-type");
      var src = vsl.getAttribute("data-src");
      var player;
      if (type === "mp4") {
        player = document.createElement("video");
        player.src = src;
        player.controls = true;
        player.autoplay = true;
        player.playsInline = true;
      } else {
        player = document.createElement("iframe");
        player.src =
          type === "vimeo"
            ? "https://player.vimeo.com/video/" + encodeURIComponent(src) + "?autoplay=1&title=0&byline=0&portrait=0"
            : "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(src) + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        player.allowFullscreen = true;
        player.title = "Video";
      }
      vsl.innerHTML = "";
      vsl.appendChild(player);
      window.dataLayer.push({ event: "VideoPlay", video_src: src });
      try { if (typeof window.fbq === "function") window.fbq("trackCustom", "VideoPlay"); } catch (e) {}
      try { if (typeof window.gtag === "function") window.gtag("event", "video_start", { video_url: src }); } catch (e) {}
    });
  }

  // ── FAQ: una pregunta abierta a la vez ───────────────────
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      faqItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // ── Formulario de Lead (opcional) ────────────────────────
  var form = document.querySelector("[data-lead-form]");
  if (form && cfg.leadEndpoint) {
    var status = form.querySelector(".lead__status");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = form.querySelector("input[type=email]");
      if (!input.checkValidity()) {
        input.focus();
        input.reportValidity();
        return;
      }
      var btn = form.querySelector("button");
      btn.disabled = true;
      fetch(cfg.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim(), source: "landing-escribe-la-palabra" }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.textContent = status.getAttribute("data-success");
          form.reset();
          track("Lead", { value: 0 });
        })
        .catch(function () {
          status.textContent = status.getAttribute("data-error");
        })
        .finally(function () { btn.disabled = false; });
    });
  }

  // ── Eventos por página ───────────────────────────────────
  if (page === "landing") {
    track("ViewContent");
  }

  if (page === "thankyou") {
    // Configura la plataforma de pago para redirigir a:
    //   gracias.html?transaction_id={ID_DE_ORDEN}&value={MONTO}
    // Si tu plataforma ya envía Purchase por su cuenta (integración nativa o API de Conversiones),
    // no configures esta redirección para evitar compras duplicadas.
    var params = new URLSearchParams(window.location.search);
    var tx = params.get("transaction_id") || params.get("order_id") || params.get("transaction");
    if (tx) {
      var key = "elp_purchase_" + tx;
      var already = false;
      try { already = !!localStorage.getItem(key); } catch (e) {}
      if (!already) {
        var value = parseFloat(params.get("value"));
        track("Purchase", {
          transaction_id: tx,
          event_id: "purchase." + tx,
          value: isNaN(value) ? product.price : value,
        });
        try { localStorage.setItem(key, "1"); } catch (e) {}
      }
    }
  }
})();
