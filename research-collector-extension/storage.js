// Funções compartilhadas entre o service worker e o popup.
const STORAGE_KEY = "items";

async function getItems() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  return data[STORAGE_KEY] || [];
}

async function setItems(items) {
  await chrome.storage.local.set({ [STORAGE_KEY]: items });
  await updateBadge(items.length);
}

async function addItem({ title, url, selection = "", note = "", tags = [] }) {
  const items = await getItems();
  const item = {
    id: crypto.randomUUID(),
    title: title || url,
    url,
    selection: selection.trim(),
    note: note.trim(),
    tags,
    createdAt: new Date().toISOString()
  };
  items.unshift(item);
  await setItems(items);
  return item;
}

async function removeItem(id) {
  const items = await getItems();
  await setItems(items.filter((item) => item.id !== id));
}

async function updateBadge(count) {
  await chrome.action.setBadgeBackgroundColor({ color: "#2563eb" });
  await chrome.action.setBadgeText({ text: count ? String(count) : "" });
}

async function getSelectionFromTab(tabId) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.getSelection().toString()
    });
    return result?.result || "";
  } catch {
    // Páginas internas (chrome://, edge://, loja de extensões) não permitem scripts.
    return "";
  }
}
