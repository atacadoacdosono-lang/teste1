// "Banco de dados" simples: guarda os pedidos em um arquivo JSON.
//
// Serve bem para começar. Quando a loja crescer, troque por um banco
// de verdade (PostgreSQL, MySQL, Supabase...) mantendo estas mesmas funções.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PASTA = path.resolve('data');
const ARQUIVO = path.join(PASTA, 'pedidos.json');

function lerTodos() {
  if (!fs.existsSync(ARQUIVO)) return [];
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));
}

function salvarTodos(pedidos) {
  fs.mkdirSync(PASTA, { recursive: true });
  // Grava num arquivo temporário e depois renomeia: evita arquivo corrompido
  // se o servidor cair no meio da gravação.
  const temporario = `${ARQUIVO}.tmp`;
  fs.writeFileSync(temporario, JSON.stringify(pedidos, null, 2));
  fs.renameSync(temporario, ARQUIVO);
}

export function criarPedido({ itens, total, cliente, metodo }) {
  const pedidos = lerTodos();
  const pedido = {
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    status: 'criado',
    metodo, // 'pix' ou 'cartao'
    itens,
    total,
    cliente,
    pagamentoId: null,
    detalheStatus: null,
  };
  pedidos.push(pedido);
  salvarTodos(pedidos);
  return pedido;
}

export function buscarPedido(id) {
  return lerTodos().find((p) => p.id === id);
}

export function listarPedidos() {
  return lerTodos().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export function atualizarPedido(id, mudancas) {
  const pedidos = lerTodos();
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return null;
  Object.assign(pedido, mudancas, { atualizadoEm: new Date().toISOString() });
  salvarTodos(pedidos);
  return pedido;
}
