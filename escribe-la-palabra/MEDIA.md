# Guia de mídia — imagens e vídeo VSL

Tudo o que você produzir entra na pasta `assets/img/` (imagens) ou é configurado em `src/content.js` (vídeo).
Depois de trocar qualquer arquivo, rode `node build.mjs`.

## 1. Vídeo VSL (topo da página)

**Onde configurar:** `src/content.js` → bloco `vsl`.

| Campo | O que colocar |
|---|---|
| `type` | `"youtube"`, `"vimeo"` ou `"mp4"` |
| `src` | ID do vídeo (YouTube: o código depois de `v=`; Vimeo: o número) ou caminho do `.mp4` |
| `poster` | Capa do vídeo (imagem 16:9, ver abaixo) |
| `badge` | Texto do selo sobre o vídeo, ex.: "Mira cómo funciona · 2 min" |
| `showPlaceholder` | Coloque `false` antes de publicar |

O vídeo só carrega quando a pessoa toca no play (a página continua rápida) e dispara o evento `VideoPlay`.

**Especificações recomendadas**
- Formato 16:9, 1920×1080, 30 fps. Duração ideal: 90 s a 3 min.
- Legendas queimadas no vídeo (muita gente assiste sem som no celular).
- Para hospedar: YouTube "não listado" ou Vimeo (sem anúncios). Evite subir `.mp4` grande no próprio site.
- Capa (`poster`): 1400×788, com o rosto de uma criança escrevendo + título curto. Salve como
  `assets/img/vsl-capa-800.webp` e `assets/img/vsl-capa-1400.webp` e use `poster: "assets/img/vsl-capa"`.

**Roteiro sugerido (em espanhol, ~2 min)**
1. **Gancho (0–10 s):** "¿Tu hijo necesita practicar su letra… y tú quieres que ese tiempo valga la pena?"
2. **Problema (10–35 s):** planas aburridas, mucho tiempo en pantallas, poco tiempo para preparar actividades.
3. **Solución (35–60 s):** presentar Escribe la Palabra — Salmos: 12 semanas, 15 minutos al día.
4. **Cómo funciona (60–100 s):** mostrar en cámara los 5 pasos con hojas reales: LEE, TRAZA, COPIA, ESCRIBE, RECUERDA.
5. **Qué incluye + bonos (100–130 s):** pasar las páginas del PDF impreso y las tarjetas.
6. **Oferta y garantía (130–150 s):** MX$149, pago único, acceso inmediato, garantía de 7 días.
7. **Llamado a la acción:** "Toca el botón de abajo y empieza hoy."

Grave com material real (o PDF impresso, uma criança real escrevendo). Não use depoimentos, números de clientes
ou resultados que ainda não existem.

## 2. Imagens da página

Para cada imagem, exporte **duas versões em WebP** com o mesmo nome base: `-800.webp` e `-1400.webp` (largura em px).
Ferramenta gratuita para converter: squoosh.app (qualidade 75–80).

| Arquivo (nome base) | Onde aparece | Proporção | O que mostrar |
|---|---|---|---|
| `familia-escribiendo` | Seção "El reto" (e capa do vídeo, se não houver outra) | 4:3 | Mãe/pai e criança escrevendo juntos, luz natural |
| `preview-cuaderno` | "Así se ve por dentro" | 4:3 | **Foto ou mockup real** do PDF impresso aberto |
| `bono-tarjetas-versiculos` | "Bonos" | 4:3 | **Foto real** das 52 tarjetas impressas (as atuais são ilustrativas e têm texto de preenchimento) |
| `vsl-capa` | Capa do vídeo | 16:9 | Frame forte do vídeo + título curto |
| `og-compartir` (opcional) | Prévia ao compartilhar no WhatsApp/Facebook | 1200×630 | Produto + nome; configure em `src/site.config.js` → `ogImage` |

**Dicas para fotos de alta qualidade**
- Cores da página: amarelo, coral, azul-céu e verde. Lápis de cor, roupas e objetos nessas cores combinam com o layout.
- Fundo claro e limpo (mesa de madeira clara, parede creme), luz de janela lateral.
- Mostre sempre o produto em uso: mãos pequenas traçando as letras, a folha com as linhas guia visível.
- Evite texto ilegível ou inventado nas folhas: use páginas reais do seu PDF.

## 3. Depois de trocar as imagens

Se uma imagem nova tiver outra proporção, atualize `width` e `height` no bloco correspondente de `src/content.js`
(evita "pulos" no carregamento).
