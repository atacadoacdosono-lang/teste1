importScripts("storage.js");

const MENU_SELECTION = "rc-save-selection";
const MENU_PAGE = "rc-save-page";
const MENU_LINK = "rc-save-link";

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_SELECTION,
      title: "Salvar trecho selecionado na pesquisa",
      contexts: ["selection"]
    });
    chrome.contextMenus.create({
      id: MENU_PAGE,
      title: "Salvar esta página na pesquisa",
      contexts: ["page"]
    });
    chrome.contextMenus.create({
      id: MENU_LINK,
      title: "Salvar link na pesquisa",
      contexts: ["link"]
    });
  });
  await updateBadge((await getItems()).length);
});

chrome.runtime.onStartup.addListener(async () => {
  await updateBadge((await getItems()).length);
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === MENU_SELECTION) {
    await addItem({ title: tab?.title, url: info.pageUrl, selection: info.selectionText || "" });
  } else if (info.menuItemId === MENU_PAGE) {
    await addItem({ title: tab?.title, url: info.pageUrl });
  } else if (info.menuItemId === MENU_LINK) {
    await addItem({
      title: info.selectionText || info.linkUrl,
      url: info.linkUrl,
      note: `Encontrado em: ${info.pageUrl}`
    });
  }
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "save-page" || !tab?.url) return;
  const selection = await getSelectionFromTab(tab.id);
  await addItem({ title: tab.title, url: tab.url, selection });
});
