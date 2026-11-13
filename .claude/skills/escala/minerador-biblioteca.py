"""
Minerador Biblioteca de Anuncios (Meta) — Escala by YM MKT

Coleta anuncios ativos no Brasil pra cada termo (via dev-browser), agrupa por
anunciante, filtra infoproduto, abre a pagina de cada oferta pra ler preco e
gateway e salva o ranking em ./mineracao/.

Uso:
  python minerador-biblioteca.py "pack,mega pack,kit completo" [nome-da-busca] [--reusar]

--reusar: aproveita a coleta de hoje com o mesmo nome (se o script parou no
meio, so coleta os termos que faltaram).

Saida: ./mineracao/[data]-biblioteca-[nome].json (lista rankeada)
Anunciantes ja mostrados em levas anteriores ficam em ./mineracao/vistos.txt
e nao voltam nas proximas mineracoes.
"""
import concurrent.futures as cf
import datetime
import html
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from urllib.parse import quote

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

PASTA = Path("mineracao")
SURROGATE = re.compile("[\ud800-\udfff]")
TMP = Path.home() / ".dev-browser" / "tmp"
PAUSA_ENTRE_TERMOS = 20  # segundos
MAX_PAGINAS = 150        # quantos anunciantes abrir pra ler preco/gateway


def devbrowser_cmd():
    win = Path(os.environ.get("APPDATA", "")) / "npm" / "dev-browser.cmd"
    if win.exists():
        return str(win)
    return shutil.which("dev-browser") or "dev-browser"


COLETA_JS = r"""
const q = __TERMO__;
const page = await browser.getPage("escala-biblioteca");
await page.goto("https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=" + encodeURIComponent(q) + "&media_type=all", {waitUntil:"domcontentloaded", timeout:60000});
await page.waitForTimeout(6000);
let parado = 0, ant = 0;
for (let i = 0; i < 40 && parado < 6; i++) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.body.scrollHeight);
  parado = h === ant ? parado + 1 : 0; ant = h;
}
const r = await page.evaluate((q) => {
  const urls = {};
  for (const a of document.querySelectorAll('a[href*="l.facebook.com/l.php"]')) {
    let e = a, id = "";
    for (let n = 0; n < 14 && e; n++, e = e.parentElement) {
      const ms = (e.innerText || "").match(/Identificação da biblioteca: ?(\d+)/g);
      if (ms) { if (ms.length === 1) id = ms[0].replace(/\D/g, ""); break; }
    }
    if (id && !urls[id]) { try { urls[id] = new URL(a.href).searchParams.get("u") || ""; } catch (e2) {} }
  }
  const t = document.body.innerText;
  const total = (t.match(/~?[\d\.]+ resultados?/) || [""])[0];
  const out = [];
  for (const p of t.split("Identificação da biblioteca:").slice(1)) {
    const L = p.split("\n").map(s => s.trim()).filter(Boolean);
    const pi = L.indexOf("Patrocinado"); if (pi < 1) continue;
    const id = (L[0]||"").replace(/\D/g,"");
    out.push({ q, id, adv: L[pi-1], url: urls[id] || "",
      since: (p.match(/Veiculação iniciada em ([^\n]+)/) || [])[1] || "",
      variants: +((p.match(/(\d+) anúncios usam/) || [])[1] || 1),
      body: L.slice(pi+1, pi+12).join(" ").replace(/\s+/g," ").slice(0, 700) });
  }
  return { total, ads: out };
}, q);
await writeFile(__ARQ__, JSON.stringify(r));
console.log("OK " + r.ads.length);
"""


def coletar(termo, i):
    arq = f"escala-bib-{i}.json"
    alvo = TMP / arq
    if alvo.exists():
        alvo.unlink()
    js = COLETA_JS.replace("__TERMO__", json.dumps(termo)).replace("__ARQ__", json.dumps(arq))
    js_path = PASTA / f".coleta-{i}.js"
    js_path.write_text(js, encoding="utf-8")
    # stdout/stderr vao pra DEVNULL: o daemon do dev-browser herda os pipes e
    # deixaria o Python esperando pra sempre se a saida fosse capturada
    try:
        with open(js_path, "rb") as fin:
            p = subprocess.Popen([devbrowser_cmd(), "--headless", "--timeout", "240"], stdin=fin,
                                 stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, shell=(os.name == "nt"))
            limite = time.time() + 300
            while p.poll() is None and time.time() < limite:
                if alvo.exists():
                    time.sleep(2)
                    break
                time.sleep(2)
    finally:
        try:
            js_path.unlink()
        except Exception:
            pass
    if not alvo.exists():
        return None
    try:
        r = json.loads(alvo.read_text(encoding="utf-8"))
        # emoji cortado ao meio vira "surrogate" solto e quebra o salvamento
        for a in r.get("ads", []):
            for k, v in a.items():
                if isinstance(v, str):
                    a[k] = SURROGATE.sub("", v)
        return r
    except Exception:
        return None
    finally:
        try:
            alvo.unlink()
        except Exception:
            pass


MES = {"jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "jun": 6, "jul": 7, "ago": 8, "set": 9, "out": 10, "nov": 11, "dez": 12}
HOJE = datetime.date.today()


def dias(s):
    m = re.search(r"(\d+) de (\w{3})\w* de (\d{4})", s)
    if not m:
        return 0
    try:
        return (HOJE - datetime.date(int(m[3]), MES.get(m[2].lower(), 1), int(m[1]))).days
    except ValueError:
        return 0


INFO = re.compile(r"pdf|arquivo|molde|projeto|apostila|e-?book|planilha|edit[áa]ve|canva|imprim|acesso (imediato|vital)|receitas|pack|kit|\+ ?\d[\d\.]{2,}|mais de \d[\d\.]{2,}|digital|pagamento [úu]nico|download|baixar|curso|aulas|m[ée]todo|lucr|renda|vender", re.I)
MARCAS = re.compile(r"infinitepay|botic|natura|avon|eudora|amazon|mercado (livre|pago)|shopee|shein|temu|alibaba|aliexpress|tiktok|uber|ifood|stone|cielo|pagbank|banco|airbnb|play\.google|apps\.apple|supermerc|farm[aá]cia|hotel|viage|turismo|im[óo]ve|autom[óo]ve|concession", re.I)
SOCIAL = re.compile(r"instagram\.com|facebook\.com|wa\.me|whatsapp|play\.google|apps\.apple|fb\.me")
GW = {"cakto": "Cakto", "kirvano": "Kirvano", "hotmart": "Hotmart", "kiwify": "Kiwify", "wiapy": "Wiapy", "ggcheckout": "GGCheckout",
      "perfectpay": "PerfectPay", "lastlink": "Lastlink", "eduzz": "Eduzz", "pepper": "Pepper", "monetizze": "Monetizze", "hubla": "Hubla",
      "greenn": "Greenn", "ticto": "Ticto", "braip": "Braip", "payt.": "Payt", "yampi": "Yampi", "wiven": "Wiven", "sunize": "Sunize",
      "lowify": "Lowify", "doppus": "Doppus", "voompcreators": "Voomp", "tribopay": "TriboPay", "zedy": "Zedy", "vega": "Vega"}
UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE


def preco(s):
    return float(s.replace(".", "").replace(",", "."))


def ler_pagina(o):
    r = {"erro": "", "gw": [], "precos": [], "fim": [], "shop": False, "dig": 0, "titulo": ""}
    for u in o["urls"][:2]:
        try:
            b = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=15, context=CTX).read(1500000).decode("utf-8", "ignore")
        except Exception as e:
            r["erro"] = str(e)[:40]
            continue
        r["shop"] |= bool(re.search(r"cdn\.shopify|myshopify|woocommerce|nuvemshop|tray\.com", b, re.I))
        low = b.lower()
        r["gw"] = sorted(set(r["gw"]) | {v for k, v in GW.items() if re.search(r"(https?:)?//[^\"'\s]*" + re.escape(k), low)})
        t = re.search(r"<title[^>]*>(.*?)</title>", b, re.I | re.S)
        if t:
            r["titulo"] = html.unescape(t[1]).strip()[:80]
        txt = html.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"<(script|style)[\s\S]*?</\1>", " ", b, flags=re.I)))
        txt = re.sub(r"\s+", " ", txt)
        r["dig"] += len(re.findall(r"acesso (imediato|vital)|pdf|e-?book|videoaulas?|apostila|m[óo]dulos?|download|garantia de \d|produto digital|[áa]rea de membros", txt, re.I))
        r["precos"] = sorted(set(r["precos"]) | {preco(p) for p in re.findall(r"R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)", txt)})
        for m in re.finditer(r"(por apenas|por somente|apenas|somente|hoje|por só|à vista|pagamento único|por)\s*:?\s*(de\s)?R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)", txt, re.I):
            r["fim"].append(preco(m[3]))
        if r["precos"]:
            break
    r["fim"] = sorted(set(r["fim"]))
    return r


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    # separa por virgula ou |, mas nao quebra preco ("R$19,90")
    termos = [t.strip() for t in re.split(r"\||,(?!\d{2}(?!\d))", sys.argv[1]) if t.strip()]
    nome = re.sub(r"[^a-z0-9]+", "-", (sys.argv[2] if len(sys.argv) > 2 else termos[0]).lower()).strip("-") or "busca"
    PASTA.mkdir(exist_ok=True)
    inicio = time.time()

    # 1) Coleta
    ads = []
    bruto = PASTA / f"{HOJE}-biblioteca-{nome}-bruto.json"
    if "--reusar" in sys.argv and bruto.exists():
        try:
            ads = json.loads(bruto.read_text(encoding="utf-8"))
        except Exception:
            ads = []  # arquivo vazio/quebrado: coleta tudo de novo
        feitos = {a["q"] for a in ads}
        print(f"Reusando coleta de hoje: {len(ads)} anuncios ({len(feitos)} termos)", flush=True)
        termos = [t for t in termos if t not in feitos]
    for i, q in enumerate(termos, 1):
        r = coletar(q, i)
        if r is None:
            print(f"[{i}/{len(termos)}] {q} | ERRO na coleta (seguindo)", flush=True)
        else:
            ads += r["ads"]
            print(f"[{i}/{len(termos)}] {q} | {r['total'] or '?'} | {len(r['ads'])} anuncios lidos", flush=True)
            bruto.write_text(SURROGATE.sub("", json.dumps(ads, ensure_ascii=False)), encoding="utf-8")
        if i < len(termos):
            time.sleep(PAUSA_ENTRE_TERMOS)

    # 2) Agrupar por anunciante e filtrar
    vf = PASTA / "vistos.txt"
    vistos = {l.strip().lower() for l in vf.read_text(encoding="utf-8").splitlines()} if vf.exists() else set()
    g = {}
    for a in ads:
        a["adv"] = re.sub("[\ud800-\udfff]", "", a["adv"]).strip()
        a["body"] = re.sub("[\ud800-\udfff]", "", a["body"])
        k = a["adv"]
        if not k or k.lower() in vistos:
            continue
        o = g.setdefault(k, {"adv": k, "ids": [], "nv": 0, "days": 0, "urls": {}, "qs": set(), "hook": "", "info": 0, "top": a["id"]})
        if a["id"] in o["ids"]:
            continue
        o["ids"].append(a["id"])
        o["nv"] += a["variants"]
        o["qs"].add(a["q"])
        d = dias(a["since"])
        if d >= o["days"]:
            o["days"], o["hook"], o["top"] = d, a["body"], a["id"]
        if a["url"]:
            o["urls"][a["url"].split("?")[0]] = 1
        o["info"] += bool(INFO.search(a["body"]))
    cand = []
    for o in g.values():
        n = len(o["ids"])
        urls = [u for u in o["urls"] if not SOCIAL.search(u)]
        if not urls or MARCAS.search(o["adv"] + " " + " ".join(urls)) or o["info"] < max(1, n * 0.4):
            continue
        o.update(urls=urls[:3], n=n, qs=sorted(o["qs"]), score=round(n * 3 + o["nv"] * 1.5 + min(o["days"], 240) / 10, 1))
        cand.append(o)
    cand.sort(key=lambda o: -o["score"])
    cand = cand[:MAX_PAGINAS]

    # 3) Ler preco e gateway nas paginas
    with cf.ThreadPoolExecutor(12) as ex:
        for o, p in zip(cand, ex.map(ler_pagina, cand)):
            o["pag"] = p

    # 4) Classificar ticket
    final = []
    for o in cand:
        p = o["pag"]
        if p["shop"] or not p["precos"] or p["dig"] < 2:
            continue
        ref = p["fim"] or p["precos"]
        if any(7 <= x <= 30 for x in ref):
            o["ticket"] = "low"
        elif any(31 <= x <= 97 for x in ref):
            o["ticket"] = "medio"
        else:
            continue
        o["link"] = f"https://www.facebook.com/ads/library/?id={o['top']}"
        final.append(o)

    saida = PASTA / f"{HOJE}-biblioteca-{nome}.json"
    saida.write_text(SURROGATE.sub("", json.dumps(final, ensure_ascii=False, indent=1)), encoding="utf-8")
    print(f"FIM | {len(ads)} anuncios | {len(g)} anunciantes novos | {len(final)} ofertas com preco "
          f"({sum(o['ticket'] == 'low' for o in final)} low, {sum(o['ticket'] == 'medio' for o in final)} medio) "
          f"| {int(time.time() - inicio) // 60} min | {saida}", flush=True)


if __name__ == "__main__":
    main()
