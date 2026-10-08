// Toda a conversa com o Mercado Pago fica neste arquivo.
// Se um dia você quiser usar outro provedor (ou dois ao mesmo tempo),
// é só criar um arquivo parecido e trocar aqui.

import { MercadoPagoConfig, Payment } from 'mercadopago';

const cliente = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 10000 },
});
const pagamentos = new Payment(cliente);

// O Mercado Pago só consegue avisar o seu servidor se o endereço for https.
// Em testes locais (http://localhost) deixamos sem aviso e o status é
// consultado direto na API.
function urlDeAviso() {
  const base = process.env.BASE_URL || '';
  return base.startsWith('https://') ? `${base}/webhooks/mercadopago` : undefined;
}

function descricao(pedido) {
  return pedido.itens.map((i) => `${i.quantidade}x ${i.nome}`).join(', ');
}

// ---------- PIX ----------
export async function criarPix(pedido) {
  const expiraEm = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

  const pagamento = await pagamentos.create({
    body: {
      transaction_amount: pedido.total,
      description: descricao(pedido),
      payment_method_id: 'pix',
      date_of_expiration: expiraEm.toISOString(),
      external_reference: pedido.id, // liga o pagamento ao nosso pedido
      notification_url: urlDeAviso(),
      payer: {
        email: pedido.cliente.email,
        first_name: pedido.cliente.nome,
        identification: { type: 'CPF', number: pedido.cliente.cpf },
      },
    },
    // Chave de idempotência: se a mesma requisição for enviada 2 vezes
    // (internet caiu, cliente clicou duas vezes), o Mercado Pago NÃO cobra 2 vezes.
    requestOptions: { idempotencyKey: `pix-${pedido.id}` },
  });

  const dados = pagamento.point_of_interaction?.transaction_data ?? {};
  return {
    pagamento,
    qrCode: dados.qr_code, // texto "copia e cola"
    qrCodeImagem: dados.qr_code_base64, // imagem do QR Code
    expiraEm: expiraEm.toISOString(),
  };
}

// ---------- CARTÃO ----------
// "dadosCartao" vem do formulário seguro do Mercado Pago (Card Payment Brick).
// O número do cartão NUNCA passa pelo nosso servidor: recebemos só um "token".
export async function criarPagamentoCartao(pedido, dadosCartao) {
  return pagamentos.create({
    body: {
      transaction_amount: pedido.total, // valor do servidor, não do navegador
      token: dadosCartao.token,
      installments: Number(dadosCartao.installments) || 1,
      payment_method_id: dadosCartao.payment_method_id,
      issuer_id: dadosCartao.issuer_id,
      description: descricao(pedido),
      external_reference: pedido.id,
      notification_url: urlDeAviso(),
      payer: {
        email: dadosCartao.payer?.email || pedido.cliente.email,
        identification: dadosCartao.payer?.identification,
      },
    },
    requestOptions: { idempotencyKey: `cartao-${pedido.id}` },
  });
}

// ---------- CONSULTA ----------
export async function consultarPagamento(id) {
  return pagamentos.get({ id });
}

// Traduz o status do Mercado Pago para o status do nosso pedido.
export function traduzirStatus(statusMercadoPago) {
  const mapa = {
    approved: 'pago',
    authorized: 'aguardando',
    pending: 'aguardando',
    in_process: 'em_analise',
    in_mediation: 'em_disputa',
    rejected: 'recusado',
    cancelled: 'cancelado',
    refunded: 'estornado',
    charged_back: 'estornado',
  };
  return mapa[statusMercadoPago] ?? 'aguardando';
}
