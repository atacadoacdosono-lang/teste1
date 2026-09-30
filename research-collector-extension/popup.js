const $ = (id) => document.getElementById(id);
let currentTab = null;

async function init() {
  [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  $("current-title").textContent = currentTab?.title || "(sem título)";
  $("current-title").title = currentTab?.url || "";
  if (currentTab?.id) $("selection").value = await getSelectionFromTab(currentTab.id);

  $("save").addEventListener("click", save);
  $("search").addEventListener("input", render);
  $("clear").addEventListener("click", clearAll);
  document.querySelectorAll("footer [data-format]").forEach((btn) =>
    btn.addEventListener("click", () => exportItems(btn.dataset.format))
  );
  chrome.storage.onChanged.addListener(render);
  render();
}

async function save() {
  if (!currentTab?.url) {
    $("status").textContent = "Não foi possível ler a página atual.";
    return;
  }
  await addItem({
    title: currentTab.title,
    url: currentTab.url,
    selection: $("selection").value,
    note: $("note").value,
    tags: $("tags").value.split(",").map((t) => t.trim()).filter(Boolean)
  });
  $("note").value = "";
  $("status").textContent = "Salvo!";
  setTimeout(() => ($("status").textContent = ""), 1500);
}

async function render() {
  const items = await getItems();
  const query = $("search").value.toLowerCase();
  const filtered = items.filter((item) =>
    [item.title, item.url, item.selection, item.note, item.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  $("count").textContent = `${items.length} ${items.length === 1 ? "item" : "itens"}`;
  $("empty").hidden = filtered.length > 0;

  const list = $("list");
  list.replaceChildren(
    ...filtered.map((item) => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.textContent = item.title;
      li.append(link);

      if (item.selection) {
        const quote = document.createElement("blockquote");
        quote.textContent = item.selection;
        li.append(quote);
      }
      if (item.note) {
        const note = document.createElement("div");
        note.textContent = item.note;
        li.append(note);
      }

      const meta = document.createElement("div");
      meta.className = "meta";
      const tags = item.tags.length ? ` · #${item.tags.join(" #")}` : "";
      meta.textContent = new Date(item.createdAt).toLocaleString("pt-BR") + tags;
      li.append(meta);

      const remove = document.createElement("button");
      remove.className = "remove";
      remove.title = "Remover";
      remove.textContent = "×";
      remove.addEventListener("click", () => removeItem(item.id));
      li.append(remove);

      return li;
    })
  );
}

async function clearAll() {
  if (confirm("Apagar todos os itens coletados?")) await setItems([]);
}

function toCsv(items) {
  const cols = ["title", "url", "selection", "note", "tags", "createdAt"];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = items.map((item) =>
    cols.map((c) => escape(c === "tags" ? item.tags.join(", ") : item[c])).join(",")
  );
  // BOM para o Excel reconhecer acentos em UTF-8.
  return "﻿" + [cols.join(","), ...rows].join("\r\n");
}

function toMarkdown(items) {
  const lines = ["# Pesquisa", ""];
  for (const item of items) {
    lines.push(`## [${item.title}](${item.url})`, "");
    if (item.selection) lines.push(...item.selection.split("\n").map((l) => `> ${l}`), "");
    if (item.note) lines.push(item.note, "");
    const tags = item.tags.length ? ` · ${item.tags.map((t) => `#${t}`).join(" ")}` : "";
    lines.push(`*${new Date(item.createdAt).toLocaleString("pt-BR")}${tags}*`, "");
  }
  return lines.join("\n");
}

async function exportItems(format) {
  const items = await getItems();
  const formats = {
    json: [JSON.stringify(items, null, 2), "application/json"],
    csv: [toCsv(items), "text/csv"],
    md: [toMarkdown(items), "text/markdown"]
  };
  const [content, type] = formats[format];
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `pesquisa-${new Date().toISOString().slice(0, 10)}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

init();
