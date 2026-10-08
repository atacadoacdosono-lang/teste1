/* Escribe la Palabra — Quiz de entrada del embudo.
 * Flujo: portada → 5 preguntas → captura del lead → "preparando" → resultado personalizado → landing / checkout
 * Eventos: QuizStart · QuizAnswer · Lead · QuizComplete (+ InitiateCheckout si va directo al pago)
 * Textos y reglas: src/quiz.content.js  ·  Webhook del CRM: src/site.config.js → quiz.webhookUrl
 */
(function () {
  "use strict";

  var dataEl = document.getElementById("quiz-data");
  if (!dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var Q = data.quiz;
  var ELP = window.ELP || { track: function () {}, trackCustom: function () {}, bindCheckout: function () {} };

  var root = document.querySelector("[data-quiz]");
  var screens = {};
  root.querySelectorAll("[data-screen]").forEach(function (el) { screens[el.getAttribute("data-screen")] = el; });
  var questionBox = root.querySelector("[data-question]");
  var resultBox = root.querySelector("[data-result]");
  var progress = root.querySelector("[data-progress]");
  var progressLabel = root.querySelector("[data-progress-label]");
  var progressFill = root.querySelector("[data-progress-fill]");

  var state = { step: 0, answers: {}, lead: {} };
  var total = Q.questions.length;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Utilidades ───────────────────────────────────────────
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fill(tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ""; });
  }
  function firstName(s) { return (s || "").trim().split(/\s+/)[0] || ""; }
  function capital(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function icon(path) {
    return '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }
  var ICON_CHECK = icon('<path d="M5 12.5l4.5 4.5L19 7.5"/>');
  var ICON_ARROW = icon('<path d="M5 12h14M13 6l6 6-6 6"/>');
  var ICON_BACK = icon('<path d="M19 12H5M11 6l-6 6 6 6"/>');

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
    progress.hidden = name !== "question";
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function optionFor(qid, value) {
    var q = Q.questions.filter(function (x) { return x.id === qid; })[0];
    return q && q.options.filter(function (o) { return o.value === value; })[0];
  }

  // ── Preguntas ────────────────────────────────────────────
  function renderQuestion() {
    var q = Q.questions[state.step];
    progressLabel.textContent = fill(Q.progressLabel, { n: state.step + 1, total: total });
    progressFill.style.width = ((state.step + 1) / total) * 100 + "%";

    var html =
      '<p class="qcard__step">' + esc(fill(Q.progressLabel, { n: state.step + 1, total: total })) + "</p>" +
      '<h2 class="h2 qcard__title" tabindex="-1">' + esc(q.title) + "</h2>" +
      (q.hint ? '<p class="qcard__hint">' + esc(q.hint) + "</p>" : "") +
      '<div class="qoptions" role="radiogroup" aria-label="' + esc(q.title) + '">' +
      q.options
        .map(function (o, i) {
          var checked = state.answers[q.id] === o.value;
          return (
            '<button type="button" class="qopt qopt--' + ["sky", "sun", "coral", "leaf", "grape"][i % 5] + (checked ? " is-selected" : "") +
            '" role="radio" aria-checked="' + checked + '" data-value="' + esc(o.value) + '">' +
            '<span class="qopt__emoji" aria-hidden="true">' + esc(o.emoji || "") + "</span>" +
            '<span class="qopt__label">' + esc(o.label) + "</span>" +
            '<span class="qopt__check" aria-hidden="true">' + ICON_CHECK + "</span></button>"
          );
        })
        .join("") +
      "</div>" +
      (state.step > 0 ? '<button type="button" class="qback" data-back>' + ICON_BACK + esc(Q.backLabel) + "</button>" : "");

    questionBox.innerHTML = html;
    questionBox.classList.remove("is-in");
    void questionBox.offsetWidth; // reinicia la animación de entrada
    questionBox.classList.add("is-in");
    var title = questionBox.querySelector(".qcard__title");
    if (title) title.focus({ preventScroll: true });
  }

  questionBox.addEventListener("click", function (e) {
    var back = e.target.closest("[data-back]");
    if (back) {
      state.step = Math.max(0, state.step - 1);
      renderQuestion();
      return;
    }
    var btn = e.target.closest(".qopt");
    if (!btn || questionBox.classList.contains("is-locked")) return;
    var q = Q.questions[state.step];
    state.answers[q.id] = btn.getAttribute("data-value");
    questionBox.querySelectorAll(".qopt").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-checked", on);
    });
    ELP.trackCustom("QuizAnswer", { quiz_step: state.step + 1, question: q.id, answer: state.answers[q.id] });

    questionBox.classList.add("is-locked");
    setTimeout(function () {
      questionBox.classList.remove("is-locked");
      if (state.step < total - 1) {
        state.step++;
        renderQuestion();
      } else {
        show("lead");
        var first = screens.lead.querySelector("input");
        if (first) first.focus({ preventScroll: true });
      }
    }, reduceMotion ? 120 : 380);
  });

  // Teclado: flechas para moverse entre opciones
  questionBox.addEventListener("keydown", function (e) {
    if (!e.target.classList.contains("qopt")) return;
    var opts = Array.prototype.slice.call(questionBox.querySelectorAll(".qopt"));
    var i = opts.indexOf(e.target);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
  });

  // ── Calificación y segmentación ──────────────────────────
  function evaluate() {
    var score = 0, tags = ["quiz_completado"], routes = [], ageLabel = "";
    Q.questions.forEach(function (q) {
      var o = optionFor(q.id, state.answers[q.id]);
      if (!o) return;
      score += o.score || 0;
      tags = tags.concat(o.tags || []);
      if (o.route) routes.push(o.route);
      if (o.ageLabel) ageLabel = o.ageLabel;
    });
    var temperature = score >= Q.scoring.hot ? "caliente" : score >= Q.scoring.warm ? "tibio" : "frio";
    tags.push("lead_" + temperature);
    routes.forEach(function (r) {
      var p = Q.products[r];
      if (p && p.status === "soon") tags.push("espera_" + r);
    });
    return { score: score, temperature: temperature, tags: tags, routes: routes, ageLabel: ageLabel, recommended: Q.result.main.product };
  }

  // ── Captura del lead ─────────────────────────────────────
  var form = screens.lead.querySelector("[data-lead]");
  function setError(key, msg) {
    var el = form.querySelector('[data-error-for="' + key + '"]');
    var input = form.querySelector('[name="' + key + '"]');
    if (el) el.textContent = msg || "";
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, firstBad = null;
    Object.keys(Q.lead.fields).forEach(function (key) {
      var f = Q.lead.fields[key];
      var input = form.querySelector('[name="' + key + '"]');
      var v = input.value.trim();
      var msg = "";
      if (f.required && !v) msg = Q.lead.errors.required;
      else if (key === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = Q.lead.errors.email;
      setError(key, msg);
      if (msg) { ok = false; firstBad = firstBad || input; }
      state.lead[key] = v;
    });
    var consent = form.querySelector('[name="consent"]');
    setError("consent", consent.checked ? "" : Q.lead.errors.consent);
    if (!consent.checked) { ok = false; firstBad = firstBad || consent; }
    if (!ok) { firstBad.focus(); return; }
    state.lead.consent = true;
    finish(true);
  });

  var skip = form.querySelector("[data-skip]");
  if (skip) skip.addEventListener("click", function () { finish(false); });

  function utms() {
    var out = {}, qs = new URLSearchParams(window.location.search);
    (data.passthroughParams || []).forEach(function (k) { if (qs.get(k)) out[k] = qs.get(k); });
    return out;
  }

  function sendLead(ev) {
    var payload = {
      source: "quiz_escribe_la_palabra",
      created_at: new Date().toISOString(),
      parent_name: state.lead.parentName || "",
      child_name: state.lead.childName || "",
      email: state.lead.email || "",
      whatsapp: state.lead.whatsapp || "",
      consent: !!state.lead.consent,
      answers: state.answers,
      score: ev.score,
      temperature: ev.temperature,
      tags: ev.tags,
      recommended_product: ev.recommended,
      waitlist: ev.routes.filter(function (r) { return Q.products[r] && Q.products[r].status === "soon"; }),
      page: window.location.href.split("#")[0],
      utm: utms(),
    };
    if (!data.webhookUrl) {
      console.warn("[Quiz] Configura quiz.webhookUrl en src/site.config.js para enviar los leads a tu CRM.", payload);
      return;
    }
    try {
      fetch(data.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(function () {});
    } catch (err) {}
  }

  function finish(withLead) {
    var ev = evaluate();
    state.result = ev;
    if (withLead) {
      sendLead(ev);
      ELP.track("Lead", { value: 0 });
      ELP.trackCustom("QuizLead", { lead_score: ev.score, lead_temperature: ev.temperature, segment: ev.tags.join(",") });
    }
    try {
      localStorage.setItem("elp_quiz", JSON.stringify({
        childName: capital(firstName(state.lead.childName)), ageLabel: ev.ageLabel, answers: state.answers, temperature: ev.temperature,
      }));
    } catch (e) {}

    show("loading");
    var items = screens.loading.querySelectorAll(".qloading__steps li");
    items.forEach(function (li) { li.classList.remove("is-done"); });
    var delay = reduceMotion ? 150 : 650;
    items.forEach(function (li, i) { setTimeout(function () { li.classList.add("is-done"); }, delay * (i + 1)); });
    setTimeout(function () { renderResult(ev); show("result"); }, delay * (items.length + 1));
  }

  // ── Resultado personalizado ──────────────────────────────
  function landingUrl(ev) {
    var url = new URL(data.landingPath, window.location.href);
    var u = utms();
    Object.keys(u).forEach(function (k) { url.searchParams.set(k, u[k]); });
    var child = firstName(state.lead.childName);
    if (child) url.searchParams.set("hijo", capital(child));
    if (ev.ageLabel) url.searchParams.set("edad", ev.ageLabel);
    url.searchParams.set("from", "quiz");
    return url.pathname.split("/").pop() + url.search;
  }

  function renderResult(ev) {
    var R = Q.result;
    var child = capital(firstName(state.lead.childName)) || R.childFallback;
    var parent = capital(firstName(state.lead.parentName));
    var vars = { hijo: esc(child), padre: esc(parent), edad: esc(ev.ageLabel) };
    var a = state.answers;
    var profile = R.profiles[a.letra] || { name: "", text: "" };
    var reasons = [];
    Object.keys(a).forEach(function (k) {
      var r = R.reasons.byAnswer[k + ":" + a[k]];
      if (r) reasons.push(r);
    });
    reasons = reasons.concat(R.reasons.general);
    var notes = ev.routes.filter(function (r, i, arr) { return arr.indexOf(r) === i && R.routeNotes[r]; });
    var main = Q.products[R.main.product];

    resultBox.innerHTML =
      '<div class="qresult">' +
        '<p class="eyebrow">' + esc(R.eyebrow) + "</p>" +
        '<h2 class="h2" tabindex="-1">' + fill(parent ? R.title : R.titleNoParent, vars) + "</h2>" +
        '<div class="qprofile">' +
          '<span class="qprofile__seal" aria-hidden="true">' + ICON_CHECK + "</span>" +
          '<div><p class="qprofile__label">' + esc(R.profileLabel) + (ev.ageLabel ? " · " + esc(ev.ageLabel) : "") + "</p>" +
          '<p class="qprofile__name">' + esc(profile.name) + "</p>" +
          '<p class="qprofile__text">' + esc(profile.text) + "</p></div>" +
        "</div>" +
        '<div class="qfacts">' +
          '<div class="qfact qfact--sky"><p class="qfact__label">' + esc(R.rhythmLabel) + "</p><p>" + esc(R.rhythms[a.tiempo] || "") + "</p></div>" +
          '<div class="qfact qfact--coral"><p class="qfact__label">' + esc(R.focusLabel) + "</p><p>" + esc(R.focus[a.reto] || "") + "</p></div>" +
        "</div>" +
        '<div class="qplan">' +
          '<p class="qplan__ribbon">' + esc(main.name) + "</p>" +
          '<h3 class="h3">' + fill(R.whyTitle, vars) + "</h3>" +
          '<ul class="qplan__list" role="list">' + reasons.map(function (r) { return "<li>" + ICON_CHECK + "<span>" + esc(r) + "</span></li>"; }).join("") + "</ul>" +
          notes.map(function (n) { return '<p class="qnote">' + R.routeNotes[n] + "</p>"; }).join("") +
          '<a class="btn btn--sun btn--block" href="' + esc(landingUrl(ev)) + '" data-result-cta><span class="btn__label">' + esc(R.main.cta) + '</span><span class="btn__arrow" aria-hidden="true">' + ICON_ARROW + "</span></a>" +
          '<a class="qplan__secondary" href="' + esc(data.checkoutUrl) + '" data-checkout data-cta-location="quiz_result">' + esc(R.main.secondary) + "</a>" +
        "</div>" +
        '<p class="caption">' + esc(R.disclaimer) + "</p>" +
      "</div>";

    var direct = resultBox.querySelector("[data-checkout]");
    if (direct && ELP.bindCheckout) {
      ELP.bindCheckout(direct);
      // Sin checkout configurado, lleva a la oferta de la landing
      if (direct.getAttribute("href") === "#oferta") direct.href = landingUrl(ev) + "#oferta";
    }
    resultBox.querySelector("[data-result-cta]").addEventListener("click", function () {
      ELP.trackCustom("QuizToLanding", { lead_temperature: ev.temperature });
    });
    ELP.trackCustom("QuizComplete", { lead_score: ev.score, lead_temperature: ev.temperature, recommended_product: ev.recommended });
    var h = resultBox.querySelector("h2");
    if (h) h.focus({ preventScroll: true });
  }

  // ── Inicio ───────────────────────────────────────────────
  root.querySelector("[data-start]").addEventListener("click", function () {
    ELP.trackCustom("QuizStart", {});
    state.step = 0;
    show("question");
    renderQuestion();
  });
})();
