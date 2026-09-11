const listaCarrinho = document.getElementById('listaCarrinho');

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function carregarCarrinho() {
  try {
    const resposta = await fetch(`${API_URL}/carrinho`, { credentials: 'include' });

    if (resposta.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    const dados = await resposta.json();

    if (dados.itens.length === 0) {
      listaCarrinho.innerHTML = `
        <p class="carregando">Seu carrinho está vazio.</p>
        <a href="index.html" class="link-conta">Ver produtos</a>
      `;
      return;
    }

    listaCarrinho.innerHTML = `
      <div class="itens-carrinho">
        ${dados.itens.map(item => `
          <div class="item-carrinho" data-id="${item.produtoId}">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="item-info">
              <h3>${item.nome}</h3>
              <p class="preco">${formatarPreco(item.preco)}</p>
            </div>
            <div class="item-quantidade">
              <input type="number" min="1" value="${item.quantidade}" class="input-quantidade" data-id="${item.produtoId}">
            </div>
            <p class="item-subtotal">${formatarPreco(item.subtotal)}</p>
            <button class="botao-remover" data-id="${item.produtoId}">Remover</button>
          </div>
        `).join('')}
      </div>
      <div class="resumo-carrinho">
        <p class="total-carrinho">Total: <strong>${formatarPreco(dados.total)}</strong></p>
        <a href="checkout.html" class="botao-checkout">Finalizar compra</a>
      </div>
    `;

    document.querySelectorAll('.input-quantidade').forEach(input => {
      input.addEventListener('change', async () => {
        const produtoId = input.dataset.id;
        const quantidade = Number(input.value);
        if (quantidade < 1) return;

        await fetch(`${API_URL}/carrinho/${produtoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ quantidade })
        });
        carregarCarrinho();
      });
    });

    document.querySelectorAll('.botao-remover').forEach(botao => {
      botao.addEventListener('click', async () => {
        const produtoId = botao.dataset.id;
        await fetch(`${API_URL}/carrinho/${produtoId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        carregarCarrinho();
      });
    });

  } catch (erro) {
    listaCarrinho.innerHTML = '<p class="carregando erro-texto">Não foi possível carregar o carrinho.</p>';
  }
}

carregarCarrinho();
