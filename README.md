# Minha Loja: checkout próprio com Pix e Cartão

Seu próprio sistema de pagamento. O cliente compra na **sua página**, com a **sua marca**,
e o Mercado Pago fica nos bastidores processando o dinheiro.

## Como funciona

```
Cliente  ──►  Sua página (public/)  ──►  Seu servidor (src/)  ──►  Mercado Pago
                                              ▲                        │
                                              └──── aviso de "pago" ◄──┘
                                                     (webhook)
```

1. O cliente escolhe os produtos e preenche nome, e-mail e CPF.
2. **Pix:** o servidor gera o QR Code e a tela confere sozinha quando o pagamento cai.
3. **Cartão:** o formulário seguro do Mercado Pago transforma o cartão em um *token*.
   O número do cartão **nunca passa pelo seu servidor**, por isso você não precisa da certificação PCI.
4. O Mercado Pago avisa o seu servidor (webhook) e o pedido muda para **pago**.
5. Você acompanha tudo no **painel** (`/admin.html`).

## Passo a passo para rodar

**1. Instale o Node.js** (versão 18 ou mais nova): https://nodejs.org

**2. Instale as dependências** (na pasta do projeto):

```bash
npm install
```

**3. Configure suas chaves:**

- Copie o arquivo `.env.example` e renomeie a cópia para `.env`
- Abra https://www.mercadopago.com.br/developers/panel/app, crie uma aplicação
  (tipo "Pagamentos online" / "Checkout Transparente")
- Em **Credenciais de teste**, copie a *Public Key* e o *Access Token* para o `.env`
- Troque a `ADMIN_PASSWORD` por uma senha sua

**4. Rode:**

```bash
npm start
```

Abra http://localhost:3000 para ver a loja e http://localhost:3000/admin.html para ver o painel.

## Testando sem gastar dinheiro

Com as credenciais de **teste**, use os cartões de teste do Mercado Pago:
https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards

- Cartão Mastercard: `5031 4332 1540 6351`, CVV `123`, validade `11/30`
- No **nome do titular**, escreva `APRO` para aprovar ou `OTHE` para recusar
- CPF: `12345678909`

## Colocando no ar (produção)

1. **Hospede** o projeto em um servidor com **https**, como Railway, Render, Fly.io ou uma VPS.
2. No `.env` do servidor:
   - troque as credenciais de teste pelas de **produção**
   - coloque em `BASE_URL` o seu endereço, por exemplo `https://minhaloja.com.br`
3. No painel do Mercado Pago, em **Webhooks**, cadastre
   `https://minhaloja.com.br/webhooks/mercadopago`, marque o evento **Pagamentos**,
   e copie a **assinatura secreta** para `MP_WEBHOOK_SECRET`.

## Onde mexer

| Quero... | Arquivo |
|---|---|
| Mudar produtos e preços | `src/produtos.js` |
| Mudar a aparência da loja | `public/index.html` e `public/estilo.css` |
| Fazer algo quando um pedido for pago (e-mail, estoque…) | `src/server.js`, na rota `/webhooks/mercadopago` |
| Mudar validade do Pix ou nº de parcelas | `src/mercadopago.js` / `public/loja.js` |

## Regras de segurança já aplicadas

- **O preço vem do servidor**, nunca do navegador (ninguém consegue pagar menos).
- **O status do pagamento é sempre conferido no Mercado Pago**, nunca na palavra do navegador.
- **Os webhooks têm a assinatura verificada**, o que impede avisos de "pago" falsos.
- **Não há cobrança dupla:** cada pedido usa uma chave de idempotência.
- **O Access Token fica só no servidor**, e o arquivo `.env` não vai para o GitHub.

## Próximos passos sugeridos

- Trocar o arquivo `data/pedidos.json` por um banco de dados (PostgreSQL/Supabase).
- Enviar e-mail de confirmação quando o pedido for pago.
- Controle de estoque.
- Botão de estorno no painel.
- Boleto.
