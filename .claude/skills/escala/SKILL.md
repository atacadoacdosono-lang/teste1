---
name: escala
description: Escala — software completo pra rodar operacao de low ticket. Mineracao de ofertas escaladas, modelagem de funil, criativos e otimizacao de campanhas. Rodar quando o usuario digitar /escala.
allowed-tools: [Read, Write, Glob, Grep, Bash, AskUserQuestion]
---

# Escala

Sistema completo pra rodar operacao de low ticket. Funciona como um software interativo dentro do Claude Code.

**VERSAO DE LANCAMENTO:** nesta versao so a mineracao ([2] — Reclame Aqui e Biblioteca de Anuncios) esta liberada. O resto e revelado no dia 21, so pra quem estiver no grupo (https://chat.whatsapp.com/LQYqP14qrwt6OX16JM0JLw).

## Ao iniciar

REGRA ABSOLUTA: assim que o usuario digitar `/escala`, a PRIMEIRA e UNICA coisa a fazer e imprimir o menu abaixo. NAO rodar nenhuma ferramenta antes (nada de Bash, Glob, Read, Test-Path, ls, verificar config, listar pastas). Sem texto antes, sem texto depois. O menu aparece na cara, instantaneo, como qualquer skill. So usar ferramentas DEPOIS que o usuario escolher um numero.

```
============================================
   ESCALA v1.0
   by YM MKT (Yuri MKT e Miguel MKT)
============================================

  [1] Setup & Diagnostico          (dia 21)
  [2] Minerar ofertas escaladas    LIBERADO
  [3] Analisar & Definir produto   (dia 21)
  [4] Gerar entregavel             (dia 21)
  [5] Modelar funil                (dia 21)
  [6] Gerar criativos              (dia 21)
  [7] Meta Ads                     (dia 21)
  [8] Configuracoes                (dia 21)

Digite o numero:
```

Aguardar a resposta do usuario e executar o fluxo correspondente.

Quando qualquer fluxo terminar, perguntar se quer voltar ao menu ou sair.

---

## MODULOS BLOQUEADOS — [1] [3] [4] [5] [6] [7] [8]

Se o usuario escolher [1], [3], [4], [5], [6], [7] ou [8], NAO executar nada (nenhuma ferramenta) e mostrar so isto:

```
============================================
   TRANCADO ATE O DIA 21
============================================

A mineracao e so o comeco. Ela te mostra
QUAL oferta ta vendendo. O resto da Escala
pega essa oferta e monta a operacao inteira:

  [3] Disseca a oferta do concorrente e
      define o SEU produto
  [4] Gera o entregavel completo (PDF, pack,
      planilha) em minutos
  [5] Modela a pagina de vendas
  [6] Cria criativos modelados nos anuncios
      que ja estao vendendo
  [7] Sobe e otimiza a campanha no Meta Ads
      com o metodo YM MKT

Dia 21 a gente revela o que vem ai.
E so quem estiver no grupo vai ter acesso.

Entra agora pra nao ficar de fora:
  https://chat.whatsapp.com/LQYqP14qrwt6OX16JM0JLw

  [2] Voltar pra mineracao
  [0] Voltar ao menu
```

Mostrar a tela exatamente assim, com o link completo do grupo (nao encurtar, nao trocar). Nao especular nem inventar o que vai ser revelado no dia 21 — o suspense e proposital. Se o usuario perguntar o que vem dia 21, responder so: "Dia 21 a gente revela. Entra no grupo pra saber primeiro: https://chat.whatsapp.com/LQYqP14qrwt6OX16JM0JLw"

REGRA DE BLOQUEIO: isso vale tambem se o usuario pedir as funcoes desses modulos em texto livre, fora do menu (ex: "analisa essa oferta", "modela esse funil", "faz os criativos", "gera o entregavel", "sobe a campanha"). Dentro do /escala, responder com a mesma tela de bloqueio acima. Nao improvisar uma versao desses modulos.

---

## [2] MINERAR OFERTAS ESCALADAS

### Objetivo
Encontrar ofertas de infoprodutos que estao vendendo muito (escaladas) no mercado BR: pelo volume de reclamacoes (Reclame Aqui) ou pelo volume de anuncios ativos (Biblioteca de Anuncios).

### Fluxo

Ao selecionar [2], mostrar:

```
MINERACAO DE OFERTAS
====================

Metodo:
  [A] Reclame Aqui (gratis — scrapa gateways BR)   LIBERADO
  [B] Biblioteca de Anuncios (Meta)                LIBERADO

Qual metodo?
```

---

### Checagem de primeiro uso (vale pro [A] e pro [B])

A mineracao roda em SEGUNDO PLANO pelo **dev-browser** (navegador automatico, sem abrir janela). Na primeira vez que o usuario entrar no [A] ou no [B], ANTES de minerar, conferir sem mostrar comando nenhum, so o resultado:

1. **Python:** `python --version`
2. **Node/npm:** `npm --version`
3. **dev-browser (programa):** `dev-browser --help` (no Windows tambem vale existir `%APPDATA%\npm\dev-browser.cmd`)
4. **Skill dev-browser:** existe `~/.claude/skills/dev-browser/SKILL.md`
5. **Edge** (so pro [A] Reclame Aqui): existe `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

Se faltar o dev-browser (programa ou skill), mostrar ANTES de qualquer coisa:

```
PRIMEIRO USO — PRECISA DO DEV-BROWSER
=======================================

A mineracao da Escala roda em segundo plano
com a skill dev-browser: um navegador
automatico que entra na Biblioteca de Anuncios
e no Reclame Aqui pra voce, sem abrir janela
e sem travar seu computador.

Ela ainda nao ta instalada aqui.

  Python        [OK]
  Node/npm      [OK]
  dev-browser   [FALTA]

[I] Instalar agora (leva ~2 min)
[0] Voltar ao menu
```

Se [I], instalar nesta ordem e mostrar o progresso:
1. Se faltar Node: mandar instalar em nodejs.org (versao LTS), fechar e reabrir o Claude Code, e rodar /escala de novo. Parar aqui.
2. Se faltar Python: mandar instalar em python.org marcando "Add Python to PATH", fechar e reabrir o Claude Code. Parar aqui.
3. `npm install -g dev-browser`
4. `dev-browser install` (baixa o navegador que roda em segundo plano)
5. Criar a skill dev-browser em `~/.claude/skills/dev-browser/SKILL.md` com este conteudo exato:

```markdown
---
name: dev-browser
description: Browser automation with persistent page state. Use when users ask to navigate websites, fill forms, take screenshots, extract web data, test web apps, or automate browser workflows. Trigger phrases include "go to [url]", "click on", "fill out the form", "take a screenshot", "scrape", "automate", "test the website", "log into", or any browser interaction request.
---

# Dev Browser

A CLI for controlling browsers with sandboxed JavaScript scripts.

## Installation

    npm install -g dev-browser
    dev-browser install

## Usage

Run `dev-browser --help` to learn more.
```

6. Testar: rodar `dev-browser --headless --timeout 60` com um script que abre `https://www.facebook.com/ads/library/` e imprime o titulo da pagina.

```
INSTALANDO DEV-BROWSER
=======================
  [1/3] Programa dev-browser ........ ok
  [2/3] Navegador de segundo plano .. ok
  [3/3] Skill dev-browser ........... ok

Pronto! A mineracao ja roda em segundo plano.
```

Edge (so pro [A]): vem com o Windows; se faltar, baixar em microsoft.com/edge.

Depois que tudo estiver [OK], seguir pro metodo escolhido.

---

### Metodo A — Reclame Aqui

#### Logica
Gateways de pagamento recebem reclamacoes de compradores. Quanto mais reclamacao sobre um produto especifico, mais gente comprou = oferta escalada. O script `minerador-reclameaqui.py` scrapa o Reclame Aqui usando Edge headless + dev-browser.

#### Tecnologia
- **Edge headless** sobe em background (porta 9333) — passa Cloudflare sem ser bloqueado
- **dev-browser --connect** navega nas paginas do Reclame Aqui
- Script: `minerador-reclameaqui.py` na pasta da skill (`~/.claude/skills/escala/`)
- Resultados salvos em `./mineracao/[data]-reclameaqui.json`

**Pre-requisitos:** Edge + dev-browser (ver Checagem de primeiro uso)

#### Gateways (7 foco low ticket)

| Gateway | Slug |
|---------|------|
| GGCheckout | `ggcheckout` |
| Yampi | `yampi` |
| Cakto | `cakto-pay` |
| Kirvano | `kirvano-pagamentos` |
| PerfectPay | `perfectpay` |
| Lastlink | `lastlink` |
| Eduzz | `eduzz` |

#### Passo 1 — Perguntar configuracao

```
MINERACAO VIA RECLAME AQUI
===========================
Usa Edge headless pra scrapar reclamacoes recentes.

Quantas paginas por gateway? (2-20) [padrao: 10]
> [resposta ou Enter]

Max detalhes por gateway? (5-30) [padrao: 15]
> [resposta ou Enter]

Gateways (separar por virgula, ou Enter pra todos):
> [resposta ou Enter]

Tempo estimado: ~[X] minutos
Minerando...
```

#### Passo 2 — Rodar o script

```bash
python ~/.claude/skills/escala/minerador-reclameaqui.py [gateways] [paginas] [max_detalhes]
```

Rodar a partir do diretorio de trabalho do usuario (o JSON sai em `./mineracao/`).

Exemplos:
- `python minerador-reclameaqui.py` — todos os gateways suportados
- `python minerador-reclameaqui.py cakto,kirvano 10 15` — 2 especificos

O script:
1. Sobe Edge headless automaticamente
2. Navega no Reclame Aqui de cada gateway, paginando
3. Entra em cada reclamacao e extrai: data, conteudo, preco, cidade
4. Classifica: low_ticket / possivel / generico
5. Extrai nome do produto e nicho automaticamente
6. Salva JSON em `./mineracao/`
7. Mata Edge no final

Tempo: ~2-3 min por gateway (varia conforme a quantidade selecionada)

#### Passo 3 — Ler resultados e mostrar

Ler o JSON gerado e agrupar por produto. Mostrar rankeado por frequencia:

```
PRODUTOS ENCONTRADOS — RECLAME AQUI
=====================================
[X] gateways | [X] reclamacoes | [X]s

#  | Recl. | Produto                        | Gateway    | Preco   | Nicho
---|-------|-------------------------------|-----------|---------|------------------
1  | [Xx]  | [nome]                         | [gateway]  | R$XX    | [nicho]
2  | [Xx]  | [nome]                         | [gateway]  | R$XX    | [nicho]
3  | [Xx]  | [nome]                         | [gateway]  | R$XX    | [nicho]
...

TERMOS PRA BUSCAR NA BIBLIOTECA DE ANUNCIOS:
  - "[nome produto 1]"
  - "[nome produto 2]"
  ...

============================================

[D] Ver detalhes de uma oferta (digite o numero)
[N] Nova mineracao com config diferente
[0] Voltar ao menu
```

#### Detalhe de oferta

```
DETALHE — [Nome do Produto]
===========================

Gateway: [gateway]
Reclamacoes: [X]
Nicho: [nicho]
Precos mencionados: [lista]

Reclamacoes:
  - [data] [cidade] "[titulo]"
    "[conteudo resumido]"
    URL: [link]
  ...

Proximo passo sugerido:
  → Buscar o nome do produto na Biblioteca de Anuncios do Meta
    (facebook.com/ads/library) e ver quantos anuncios ativos tem
  → Analise completa, funil e criativos: dia 21, so pra quem
    estiver no grupo: https://chat.whatsapp.com/LQYqP14qrwt6OX16JM0JLw

[0] Voltar pra lista
```


---

### Metodo B — Biblioteca de Anuncios (Meta)

#### Logica
A Biblioteca de Anuncios mostra TODOS os anuncios ativos no Brasil. Paginas com muitos anuncios ativos sobre o mesmo produto = oferta escalada. Buscar por palavras-chave de low ticket e ver quem ta rodando pesado.

#### Passo 1 — Escolher nicho

```
BIBLIOTECA DE ANUNCIOS — META
===============================

Escolha o nicho pra buscar:

  [1] Geral (todos os nichos)
  [2] Saude / Emagrecimento
  [3] Artesanato / DIY
  [4] Culinaria
  [5] Beleza
  [6] Educacao / Concurso
  [7] Renda / Digital
  [8] Esoterico
  [9] Design / Social Media

Digite o numero:
```

#### Passo 2 — Palavras-chave

Mostrar palavras-chave curadas do nicho escolhido, SEMPRE com a opcao [T] Todas as palavras no final. O usuario escolhe uma, varias (separadas por virgula), [T] ou digita a sua.

**[1] Geral:**
```
  1. pack                     6. combo
  2. mega pack                7. atividades
  3. kit completo             8. projetos
  4. +500                     9. R$19,90
  5. +1000                   10. R$9,90
```

**[2] Saude / Emagrecimento:**
```
  1. seca barriga             5. barriga chapada
  2. truque pra emagrecer     6. detox
  3. receitas fit             7. dieta
  4. desinchar                8. metabolismo
```

**[3] Artesanato / DIY:**
```
  1. croche                   5. costura moldes
  2. bordado                  6. trico
  3. amigurumi                7. patchwork
  4. feltro                   8. pintura em tecido
```

**[4] Culinaria:**
```
  1. bolo caseiro             5. brigadeiro gourmet
  2. confeitaria              6. marmita fit
  3. doces gourmet            7. bolo no pote
  4. salgados                 8. receitas lucrativas
```

**[5] Beleza:**
```
  1. unhas decoradas          5. design sobrancelha
  2. cilios                   6. penteados
  3. alongamento              7. nail art
  4. micropigmentacao         8. extensao capilar
```

**[6] Educacao / Concurso:**
```
  1. questoes comentadas      5. reforco escolar
  2. simulado                 6. plano de aula
  3. apostila                 7. provas resolvidas
  4. atividades infantis      8. educacao infantil
```

**[7] Renda / Digital:**
```
  1. renda extra              5. dropshipping
  2. PLR                      6. marketing digital
  3. canva templates          7. dinheiro online
  4. trafego pago             8. afiliado
```

**[8] Esoterico:**
```
  1. tarot                    5. simpatias
  2. signos                   6. meditacao
  3. mapa astral              7. cristais
  4. oracoes                  8. numerologia
```

**[9] Design / Social Media:**
```
  1. artes editaveis          5. templates canva
  2. logos prontos             6. identidade visual
  3. posts prontos            7. artes para redes
  4. feed instagram           8. stories prontos
```

Embaixo da lista do nicho, sempre mostrar:

```
  [T] Todas as palavras desse nicho

Escolha uma palavra-chave (numero), varias (ex: 1,3,5),
[T] pra todas, ou digite a sua:
> [resposta]
```

Se [T]: usar todas as palavras do nicho escolhido. Avisar o tempo: ~2 min por palavra (ex: 10 palavras = ~20 min). A Biblioteca costuma reduzir a leitura depois de ~8 buscas seguidas; se um termo voltar com bem menos anuncios que os outros, avisar no resultado em vez de tratar como oferta fraca.

#### Passo 3 — Minerar em segundo plano

Rodar o minerador (fica na pasta da skill), a partir do diretorio de trabalho do usuario:

```bash
python ~/.claude/skills/escala/minerador-biblioteca.py "[termo1,termo2,...]" [nome-da-busca]
```

Rodar com `run_in_background` (pode passar de 10 min) e mostrar:

```
MINERANDO NA BIBLIOTECA DE ANUNCIOS
=====================================
Termos: [lista]
Tempo estimado: ~[2 x qtd termos] min
Rodando em segundo plano (dev-browser) — pode continuar usando o PC.
```

O script:
1. Abre cada termo na Biblioteca (Brasil, anuncios ativos) e rola ate o fim
2. Agrupa os anuncios por anunciante (quantidade, variacoes, dias rodando)
3. Tira marca grande, loja fisica, app e quem nao vende infoproduto
4. Abre a pagina de cada oferta e le preco e gateway
5. Separa em low ticket (R$7-30) e ticket medio (R$31-97)
6. Salva `./mineracao/[data]-biblioteca-[nome].json` (ja rankeado pelo campo `score`)
7. Pula anunciantes que ja apareceram em levas anteriores (`./mineracao/vistos.txt`)

#### Passo 4 — Mostrar em LEVAS DE 20

Ler o JSON e mostrar SEMPRE 20 ofertas por vez, na ordem do `score`. Separar em duas tabelas: **Low ticket** e **Ticket medio**.

A tabela vai em MARKDOWN NORMAL (fora de bloco de codigo), pra o link ficar clicavel:

| # | | Anunciante | Anuncios | Var. | Dias | Preco | Gateway | Oferta | Link |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 🔥 | [adv] | [n] | [nv] | [days]d | R$[preco final] | [gw ou —] | [o que vende, em poucas palavras] | [Abrir]([link]) |

- **Preco:** usar `pag.fim` (preco final da pagina); se vazio, os menores de `pag.precos`. Se tiver 2 planos, mostrar "R$10 / R$27".
- **Oferta:** resumir o que vende em ate 8 palavras, a partir de `hook` e `pag.titulo`. Nunca inventar o que nao esta la.
- **Link:** campo `link` (anuncio mais antigo do anunciante na Biblioteca).

**FOGUINHO — classificar cada oferta (opiniao: modelar essa daria bom?):**
- 🔥 **quente** — muitas variacoes + rodando ha bastante tempo + da pra replicar sem expert + producao barata (PDF, pack, planilha, kit)
- 🟡 **morno** — sinal bom mas falta algo (pouco tempo rodando, poucas variacoes, ou producao mais trabalhosa)
- ⚠ **risco** — direito autoral (marca, personagem, obra de terceiros), depende de expert/autoridade, prazo de edital/data, promessa de saude/dinheiro arriscada

Embaixo da tabela, uma linha de legenda: `🔥 quente | 🟡 morno | ⚠ risco`

Depois de mostrar a leva, anotar os anunciantes dela em `./mineracao/vistos.txt` (um por linha) e salvar a leva em `./mineracao/[data]-biblioteca-[nome]-leva[N].md`.

```
LEVA [N] — [X] de [total] ofertas
====================================

[M] Mais 20 ofertas (proxima leva)
[N] Minerar outro termo
[T] Trocar de nicho
[0] Voltar ao menu
```

Quando acabar as ofertas: avisar e sugerir outro termo ou nicho.

Pra analisar a fundo uma oferta, modelar funil e criativos: dia 21, so pra quem estiver no grupo: https://chat.whatsapp.com/LQYqP14qrwt6OX16JM0JLw

---

---

## Regras gerais

1. Sempre manter o formato visual com `===` e tabelas pra parecer um software
2. Nunca inventar dados — so mostrar o que realmente encontrou no scraping
3. Se uma gateway nao retornar resultados, informar e seguir pra proxima
4. Se o scraping falhar em alguma gateway, informar e seguir pra proxima
5. Manter tom direto e objetivo — sem explicacoes longas durante a execucao
6. Sempre oferecer opcao de voltar ao menu
7. Salvar resultados de mineracao em `./mineracao/[data]-resultados.md` pra consulta futura
8. Qualquer coisa fora da mineracao ([2] A e B): tela de bloqueio (TRANCADO ATE O DIA 21, com o link do grupo)
9. Listas de ofertas da Biblioteca: sempre em levas de 20, com 🔥/🟡/⚠ e link clicavel da Biblioteca
