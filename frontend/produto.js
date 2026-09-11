const detalheProduto = document.getElementById('detalheProduto');

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get('id');

async function carregarProduto() {
  if (!idProduto) {
    detalheProduto.innerHTML = '<p class="carregando erro-texto">Produto não especificado.</p>';
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/produtos/${idProduto}`);

    if (!resposta.ok) {
      detalheProduto.innerHTML = '<p class="carregando erro-texto">Produto não encontrado.</p>';
      return;
    }

    const dados = await resposta.json();
    const produto = dados.produto;

    detalheProduto.innerHTML = `
      <div class="detalhe-grid">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="detalhe-info">
          <span class="categoria">${produto.categoria}</span>
          <h2>${produto.nome}</h2>
          <p class="descricao">${produto.descricao}</p>
          <p class="preco-grande">${formatarPreco(produto.preco)}</p>
          <p class="estoque">${produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}</p>
          <button id="botaoAdicionar" ${produto.estoque === 0 ? 'disabled' : ''}>Adicionar ao carrinho</button>
        </div>
      </div>
    `;

    document.getElementById('botaoAdicionar').addEventListener('click', async () => {
      const botao = document.getElementById('botaoAdicionar');
      botao.disabled = true;
      botao.textContent = 'Adicionando...';

      try {
        const respostaCarrinho = await fetch(`${API_URL}/carrinho/adicionar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ produtoId: produto.id, quantidade: 1 })
        });

        if (respostaCarrinho.status === 401) {
          window.location.href = 'login.html';
          return;
        }

        if (!respostaCarrinho.ok) {
          const erroDados = await respostaCarrinho.json();
          alert(erroDados.erro || 'Erro ao adicionar ao carrinho.');
          return;
        }

        botao.textContent = 'Adicionado ✓';
        setTimeout(() => {
          botao.textContent = 'Adicionar ao carrinho';
          botao.disabled = false;
        }, 1200);

      } catch (erro) {
        alert('Não foi possível adicionar ao carrinho.');
        botao.disabled = false;
        botao.textContent = 'Adicionar ao carrinho';
      }
    });

  } catch (erro) {
    detalheProduto.innerHTML = '<p class="carregando erro-texto">Não foi possível carregar o produto.</p>';
  }
}

carregarProduto();
