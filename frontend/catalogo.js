const gradeProdutos = document.getElementById('grade-produtos');

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function carregarProdutos() {
  try {
    const resposta = await fetch(`${API_URL}/produtos`);
    const dados = await resposta.json();

    if (!dados.produtos || dados.produtos.length === 0) {
      gradeProdutos.innerHTML = '<p class="carregando">Nenhum produto encontrado.</p>';
      return;
    }

    gradeProdutos.innerHTML = dados.produtos.map(produto => `
      <a href="produto.html?id=${produto.id}" class="card-produto">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="card-info">
          <span class="categoria">${produto.categoria}</span>
          <h3>${produto.nome}</h3>
          <p class="preco">${formatarPreco(produto.preco)}</p>
        </div>
      </a>
    `).join('');

  } catch (erro) {
    gradeProdutos.innerHTML = '<p class="carregando erro-texto">Não foi possível carregar os produtos. Verifique se o backend está rodando.</p>';
  }
}

carregarProdutos();
