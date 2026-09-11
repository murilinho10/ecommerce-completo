const confirmacaoPedido = document.getElementById('confirmacaoPedido');

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const parametros = new URLSearchParams(window.location.search);
const idPedido = parametros.get('id');

async function carregarConfirmacao() {
  if (!idPedido) {
    confirmacaoPedido.innerHTML = '<p class="carregando erro-texto">Pedido não especificado.</p>';
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`, { credentials: 'include' });

    if (resposta.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    if (!resposta.ok) {
      confirmacaoPedido.innerHTML = '<p class="carregando erro-texto">Pedido não encontrado.</p>';
      return;
    }

    const dados = await resposta.json();
    const pedido = dados.pedido;

    confirmacaoPedido.innerHTML = `
      <div class="icone-sucesso">✓</div>
      <h2>Pedido confirmado!</h2>
      <p class="carregando">Pedido #${pedido.id}</p>

      <div class="resumo-itens-confirmacao">
        ${pedido.itens.map(item => `
          <div class="resumo-item">
            <span>${item.quantidade}x ${item.nome}</span>
            <span>${formatarPreco(item.subtotal)}</span>
          </div>
        `).join('')}
        <div class="resumo-item resumo-total">
          <span>Total</span>
          <span>${formatarPreco(pedido.total)}</span>
        </div>
      </div>

      <p class="endereco-confirmacao">
        Entrega em: ${pedido.endereco.rua}, ${pedido.endereco.cidade} — CEP ${pedido.endereco.cep}
      </p>

      <a href="index.html" class="link-conta">Continuar comprando</a>
      &nbsp;·&nbsp;
      <a href="pedidos.html" class="link-conta">Ver meus pedidos</a>
    `;

  } catch (erro) {
    confirmacaoPedido.innerHTML = '<p class="carregando erro-texto">Não foi possível carregar o pedido.</p>';
  }
}

carregarConfirmacao();
