// Catálogo de produtos da loja.
//
// IMPORTANTE: o preço SEMPRE vem daqui (do servidor), nunca do navegador.
// Se o preço viesse do navegador, qualquer pessoa poderia alterar o valor
// e pagar R$ 0,01 por um produto de R$ 100.

export const produtos = [
  { id: 'camiseta', nome: 'Camiseta básica', preco: 49.9 },
  { id: 'bone', nome: 'Boné', preco: 39.9 },
  { id: 'caneca', nome: 'Caneca personalizada', preco: 29.9 },
];

export function buscarProduto(id) {
  return produtos.find((p) => p.id === id);
}

// Recebe a lista do carrinho ([{ produtoId, quantidade }]) e devolve
// os itens com nome e preço do servidor, mais o total.
export function calcularCarrinho(itensRecebidos) {
  if (!Array.isArray(itensRecebidos) || itensRecebidos.length === 0) {
    throw new Error('Carrinho vazio.');
  }

  const itens = itensRecebidos.map((item) => {
    const produto = buscarProduto(item.produtoId);
    const quantidade = Number(item.quantidade);

    if (!produto) throw new Error(`Produto não encontrado: ${item.produtoId}`);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 100) {
      throw new Error(`Quantidade inválida para ${produto.nome}.`);
    }

    return {
      produtoId: produto.id,
      nome: produto.nome,
      precoUnitario: produto.preco,
      quantidade,
    };
  });

  // Soma em centavos para evitar erros de arredondamento (0.1 + 0.2 != 0.3)
  const totalCentavos = itens.reduce(
    (soma, i) => soma + Math.round(i.precoUnitario * 100) * i.quantidade,
    0,
  );

  return { itens, total: totalCentavos / 100 };
}
