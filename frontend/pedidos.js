const listaPedidos = document.getElementById('listaPedidos');

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

async function carregarPedidos() {
  try {
    const resposta = await fetch(`${API_URL}/pedidos`, { credentials: 'include' });

    if (resposta.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    const dados = await resposta.json();

    if (dados.pedidos.length === 0) {
      listaPedidos.innerHTML = `
        <p class="carregando">Você ainda não fez nenhum pedido.</p>
        <a href="index.html" class="link-conta">Ver produtos</a>
      `;
      return;
    }

    listaPedidos.innerHTML = dados.pedidos.map(pedido => `
      <div class="card-pedido">
        <div class="card-pedido-topo">
          <span>Pedido #${pedido.id}</span>
          <span class="status-pedido">${pedido.status}</span>
        </div>
        <p class="data-pedido">${formatarData(pedido.criadoEm)}</p>
        <div class="itens-pedido-resumo">
          ${pedido.itens.map(item => `<span>${item.quantidade}x ${item.nome}</span>`).join(', ')}
        </div>
        <p class="total-pedido">${formatarPreco(pedido.total)}</p>
      </div>
    `).join('');

  } catch (erro) {
    listaPedidos.innerHTML = '<p class="carregando erro-texto">Não foi possível carregar os pedidos.</p>';
  }
}

carregarPedidos();
