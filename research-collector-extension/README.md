# Research Collector

Extensão para Chrome e Edge (Manifest V3) que coleta páginas, trechos
selecionados e anotações durante uma pesquisa e exporta tudo em JSON, CSV ou
Markdown. Os dados ficam salvos só no seu navegador (`chrome.storage.local`).

## Como instalar no Chrome/Edge

1. Abra o navegador.
2. Vá em:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta `research-collector-extension`.

Dica: fixe o ícone da extensão na barra de ferramentas (ícone de quebra-cabeça → alfinete).

## Como usar

- **Popup (clique no ícone):** mostra a página atual, preenche o texto que
  estiver selecionado e permite adicionar anotação e tags antes de salvar.
- **Menu do botão direito:**
  - *Salvar trecho selecionado na pesquisa*
  - *Salvar esta página na pesquisa*
  - *Salvar link na pesquisa*
- **Atalho:** `Alt+Shift+S` salva a página atual (com o trecho selecionado).
  Pode ser alterado em `chrome://extensions/shortcuts` ou `edge://extensions/shortcuts`.
- **Busca:** filtre a coleção por título, URL, trecho, anotação ou tag.
- **Exportar:** botões JSON, CSV (abre no Excel com acentos corretos) e Markdown.
- **Limpar:** apaga toda a coleção (pede confirmação).

O número de itens coletados aparece no ícone da extensão.

## Observação

Páginas internas do navegador (`chrome://`, `edge://`, loja de extensões) não
permitem ler o texto selecionado; nelas só título e URL são salvos.
