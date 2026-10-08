// Código que roda no navegador do cliente.

const formatarReais = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const tela = {
  produtos: document.getElementById('produtos'),
  total: document.getElementById('total'),
  mensagem: document.getElementById('mensagem'),
  areaPix: document.getElementById('area-pix'),
  areaCartao: document.getElementById('area-cartao'),
  areaSucesso: document.getElementById('area-sucesso'),
};

let produtos = [];
let mercadoPago = null;
let formularioCartao = null;
let verificadorPix = null;

// ---------------- Carrinho ----------------

function lerCarrinho() {
  return produtos
    .map((p) => ({
      produtoId: p.id,
      quantidade: Number(document.getElementById(`qtd-${p.id}`).value) || 0,
    }))
    .filter((item) => item.quantidade > 0);
}

// Este total é só para mostrar na tela. O valor cobrado é calculado no servidor.
function totalNaTela() {
  return lerCarrinho().reduce((soma, item) => {
    const produto = produtos.find((p) => p.id === item.produtoId);
    return soma + produto.preco * item.quantidade;
  }, 0);
}

function atualizarTotal() {
  tela.total.textContent = formatarReais(totalNaTela());
  limparPagamento(); // se mudou o carrinho, recomeça o pagamento
}

function lerCliente() {
  return {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cpf: document.getElementById('cpf').value,
  };
}

function mostrarMensagem(texto, tipo = 'erro') {
  tela.mensagem.textContent = texto;
  tela.mensagem.className = `mensagem ${tipo}`;
}

function limparPagamento() {
  clearInterval(verificadorPix);
  tela.areaPix.hidden = true;
  if (formularioCartao) {
    formularioCartao.unmount();
    formularioCartao = null;
  }
  mostrarMensagem('', '');
}

function mostrarSucesso(pedidoId) {
  limparPagamento();
  document.getElementById('pedido-numero').textContent = pedidoId;
  tela.areaSucesso.hidden = false;
  tela.areaSucesso.scrollIntoView({ behavior: 'smooth' });
}

function validarAntesDePagar() {
  if (lerCarrinho().length === 0) {
    mostrarMensagem('Escolha pelo menos um produto.');
    return false;
  }
  const cliente = lerCliente();
  if (!cliente.nome || !cliente.email || !cliente.cpf) {
    mostrarMensagem('Preencha nome, e-mail e CPF.');
    return false;
  }
  return true;
}

async function enviar(url, dados) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  const json = await resposta.json();
  if (!resposta.ok) throw new Error(json.erro || 'Erro inesperado.');
  return json;
}

// ---------------- PIX ----------------

async function pagarComPix() {
  limparPagamento();
  if (!validarAntesDePagar()) return;

  mostrarMensagem('Gerando Pix…', 'info');
  try {
    const pix = await enviar('/api/pagar/pix', { itens: lerCarrinho(), cliente: lerCliente() });

    document.getElementById('pix-imagem').src = `data:image/png;base64,${pix.qrCodeImagem}`;
    document.getElementById('pix-codigo').value = pix.qrCode;
    tela.areaPix.hidden = false;
    mostrarMensagem(`Valor: ${formatarReais(pix.total)} — o código vale por 30 minutos.`, 'info');

    // Pergunta ao servidor a cada 4 segundos se o Pix já foi pago.
    verificadorPix = setInterval(async () => {
      const pedido = await (await fetch(`/api/pedidos/${pix.pedidoId}`)).json();
      if (pedido.status === 'pago') mostrarSucesso(pedido.id);
      if (['cancelado', 'recusado'].includes(pedido.status)) {
        limparPagamento();
        mostrarMensagem('O Pix expirou ou foi cancelado. Gere um novo.');
      }
    }, 4000);
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

// ---------------- CARTÃO ----------------

const MOTIVOS_RECUSA = {
  cc_rejected_insufficient_amount: 'Saldo/limite insuficiente.',
  cc_rejected_bad_filled_security_code: 'Código de segurança (CVV) incorreto.',
  cc_rejected_bad_filled_date: 'Data de validade incorreta.',
  cc_rejected_bad_filled_other: 'Confira os dados do cartão.',
  cc_rejected_call_for_authorize: 'Ligue para o banco do cartão para autorizar a compra.',
  cc_rejected_high_risk: 'Pagamento recusado por segurança. Tente outro cartão ou Pix.',
};

async function pagarComCartao() {
  limparPagamento();
  if (!validarAntesDePagar()) return;

  const bricks = mercadoPago.bricks();
  formularioCartao = await bricks.create('cardPayment', 'area-cartao', {
    initialization: {
      amount: totalNaTela(),
      payer: { email: lerCliente().email },
    },
    customization: {
      paymentMethods: { maxInstallments: 12 },
    },
    callbacks: {
      onReady: () => {},
      onError: (erro) => console.error(erro),
      // Chamado quando o cliente clica em "Pagar".
      // "dadosCartao" contém um TOKEN, não o número do cartão.
      onSubmit: async (dadosCartao) => {
        try {
          const pedido = await enviar('/api/pagar/cartao', {
            itens: lerCarrinho(),
            cliente: lerCliente(),
            dadosCartao,
          });

          if (pedido.status === 'pago') {
            mostrarSucesso(pedido.id);
          } else if (pedido.status === 'em_analise') {
            mostrarMensagem('Pagamento em análise. Você receberá a confirmação em breve.', 'info');
          } else {
            mostrarMensagem(MOTIVOS_RECUSA[pedido.detalheStatus] || 'Pagamento recusado. Tente outro cartão ou Pix.');
          }
        } catch (erro) {
          mostrarMensagem(erro.message);
        }
      },
    },
  });
}

// ---------------- Início ----------------

async function iniciar() {
  const config = await (await fetch('/api/config')).json();
  mercadoPago = new MercadoPago(config.publicKey, { locale: 'pt-BR' });

  produtos = await (await fetch('/api/produtos')).json();
  tela.produtos.innerHTML = produtos
    .map(
      (p) => `
      <div class="produto">
        <span>${p.nome}</span>
        <span>${formatarReais(p.preco)}</span>
        <input id="qtd-${p.id}" type="number" min="0" max="100" value="0" aria-label="Quantidade de ${p.nome}">
      </div>`,
    )
    .join('');
  tela.produtos.addEventListener('input', atualizarTotal);

  document.getElementById('btn-pix').addEventListener('click', pagarComPix);
  document.getElementById('btn-cartao').addEventListener('click', pagarComCartao);
  document.getElementById('btn-copiar').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('pix-codigo').value);
    mostrarMensagem('Código copiado! Cole no app do seu banco.', 'info');
  });
}

iniciar();
