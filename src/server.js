// Servidor principal da loja: recebe os pedidos, cria os pagamentos
// no Mercado Pago e recebe os avisos (webhooks) de pagamento aprovado.

import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import { WebhookSignatureValidator } from 'mercadopago';
import { produtos, calcularCarrinho } from './produtos.js';
import { criarPedido, buscarPedido, listarPedidos, atualizarPedido } from './pedidos.js';
import {
  criarPix,
  criarPagamentoCartao,
  consultarPagamento,
  traduzirStatus,
} from './mercadopago.js';

if (!process.env.MP_ACCESS_TOKEN || !process.env.MP_PUBLIC_KEY) {
  console.error('Faltam MP_ACCESS_TOKEN e/ou MP_PUBLIC_KEY no arquivo .env');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

// ---------------------------------------------------------------
// Funções de apoio
// ---------------------------------------------------------------

function validarCliente({ nome, email, cpf } = {}) {
  const cpfLimpo = String(cpf ?? '').replace(/\D/g, '');
  if (!nome || String(nome).trim().length < 2) throw new Error('Informe seu nome.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? ''))) throw new Error('E-mail inválido.');
  if (cpfLimpo.length !== 11) throw new Error('CPF deve ter 11 números.');
  return { nome: String(nome).trim(), email: String(email).trim(), cpf: cpfLimpo };
}

// Atualiza o pedido com o status atual do pagamento no Mercado Pago.
// O Mercado Pago é sempre a "fonte da verdade": nunca confiamos
// no que o navegador diz sobre o pagamento.
async function sincronizarPagamento(pagamentoId) {
  const pagamento = await consultarPagamento(pagamentoId);
  const pedidoId = pagamento.external_reference;
  if (!pedidoId || !buscarPedido(pedidoId)) return null;

  return atualizarPedido(pedidoId, {
    pagamentoId: String(pagamento.id),
    status: traduzirStatus(pagamento.status),
    detalheStatus: pagamento.status_detail,
  });
}

// O que o navegador do cliente pode ver do pedido (sem dados pessoais).
function resumoPublico(pedido) {
  return {
    id: pedido.id,
    status: pedido.status,
    total: pedido.total,
    metodo: pedido.metodo,
    detalheStatus: pedido.detalheStatus,
  };
}

function responderErro(res, erro) {
  // Erros do Mercado Pago trazem detalhes técnicos: mostramos no log,
  // mas para o cliente vai uma mensagem simples.
  console.error('Erro:', erro?.message, erro?.cause ?? '');
  const mensagem = erro?.name === 'Error' ? erro.message : 'Não foi possível processar o pagamento.';
  res.status(400).json({ erro: mensagem });
}

// ---------------------------------------------------------------
// Rotas da loja
// ---------------------------------------------------------------

// Configurações que o navegador precisa (só a chave PÚBLICA).
app.get('/api/config', (req, res) => {
  res.json({ publicKey: process.env.MP_PUBLIC_KEY });
});

app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

// Pagar com PIX: cria o pedido e devolve o QR Code.
app.post('/api/pagar/pix', async (req, res) => {
  let pedido;
  try {
    const cliente = validarCliente(req.body.cliente);
    const { itens, total } = calcularCarrinho(req.body.itens);
    pedido = criarPedido({ itens, total, cliente, metodo: 'pix' });

    const pix = await criarPix(pedido);
    atualizarPedido(pedido.id, {
      pagamentoId: String(pix.pagamento.id),
      status: traduzirStatus(pix.pagamento.status),
    });

    res.json({
      pedidoId: pedido.id,
      total,
      qrCode: pix.qrCode,
      qrCodeImagem: pix.qrCodeImagem,
      expiraEm: pix.expiraEm,
    });
  } catch (erro) {
    if (pedido) atualizarPedido(pedido.id, { status: 'falhou' });
    responderErro(res, erro);
  }
});

// Pagar com CARTÃO: recebe o token do formulário seguro e cobra.
app.post('/api/pagar/cartao', async (req, res) => {
  let pedido;
  try {
    const cliente = validarCliente(req.body.cliente);
    const { itens, total } = calcularCarrinho(req.body.itens);
    const dadosCartao = req.body.dadosCartao;
    if (!dadosCartao?.token) throw new Error('Dados do cartão não recebidos.');

    pedido = criarPedido({ itens, total, cliente, metodo: 'cartao' });
    const pagamento = await criarPagamentoCartao(pedido, dadosCartao);

    const atualizado = atualizarPedido(pedido.id, {
      pagamentoId: String(pagamento.id),
      status: traduzirStatus(pagamento.status),
      detalheStatus: pagamento.status_detail,
    });

    res.json(resumoPublico(atualizado));
  } catch (erro) {
    if (pedido) atualizarPedido(pedido.id, { status: 'falhou' });
    responderErro(res, erro);
  }
});

// Consulta do status (a tela do Pix pergunta isso a cada poucos segundos).
app.get('/api/pedidos/:id', async (req, res) => {
  let pedido = buscarPedido(req.params.id);
  if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });

  // Se ainda está aguardando, confere direto no Mercado Pago.
  // (Útil em testes locais, onde o webhook não consegue chegar.)
  if (pedido.pagamentoId && ['criado', 'aguardando', 'em_analise'].includes(pedido.status)) {
    try {
      pedido = (await sincronizarPagamento(pedido.pagamentoId)) ?? pedido;
    } catch (erro) {
      console.error('Falha ao consultar pagamento:', erro?.message);
    }
  }

  res.json(resumoPublico(pedido));
});

// ---------------------------------------------------------------
// Webhook: o Mercado Pago chama esta rota quando um pagamento muda
// ---------------------------------------------------------------
app.post('/webhooks/mercadopago', async (req, res) => {
  const pagamentoId = req.query['data.id'] ?? req.body?.data?.id;
  const tipo = req.query.type ?? req.body?.type;

  // Confere se o aviso veio mesmo do Mercado Pago (assinatura secreta).
  if (process.env.MP_WEBHOOK_SECRET) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: req.headers['x-signature'],
        xRequestId: req.headers['x-request-id'],
        dataId: req.query['data.id'],
        secret: process.env.MP_WEBHOOK_SECRET,
        toleranceSeconds: 300,
      });
    } catch (erro) {
      console.warn('Webhook com assinatura inválida:', erro?.reason ?? erro?.message);
      return res.sendStatus(401);
    }
  } else {
    console.warn('MP_WEBHOOK_SECRET não configurado: webhook aceito sem verificar assinatura.');
  }

  // Responde rápido para o Mercado Pago não ficar reenviando.
  res.sendStatus(200);

  if (tipo !== 'payment' || !pagamentoId) return;
  try {
    const pedido = await sincronizarPagamento(pagamentoId);
    if (pedido) console.log(`Pedido ${pedido.id} agora está: ${pedido.status}`);
    // Aqui é o lugar para: enviar e-mail de confirmação, baixar estoque, emitir nota...
  } catch (erro) {
    console.error('Falha ao processar webhook:', erro?.message);
  }
});

// ---------------------------------------------------------------
// Painel administrativo (protegido por senha)
// ---------------------------------------------------------------
function senhaCorreta(senhaRecebida) {
  const esperada = Buffer.from(process.env.ADMIN_PASSWORD ?? '');
  const recebida = Buffer.from(String(senhaRecebida ?? ''));
  return (
    esperada.length > 0 &&
    esperada.length === recebida.length &&
    crypto.timingSafeEqual(esperada, recebida)
  );
}

app.get('/api/admin/pedidos', (req, res) => {
  if (!senhaCorreta(req.headers['x-admin-password'])) {
    return res.status(401).json({ erro: 'Senha incorreta.' });
  }
  res.json(listarPedidos());
});

// ---------------------------------------------------------------
const porta = Number(process.env.PORT) || 3000;
app.listen(porta, () => {
  console.log(`Loja rodando em http://localhost:${porta}`);
  console.log(`Painel de pedidos em http://localhost:${porta}/admin.html`);
});
