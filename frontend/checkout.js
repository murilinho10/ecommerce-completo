const formCheckout = document.getElementById('formCheckout');
const mensagemDiv = document.getElementById('mensagem');
const resumoItens = document.getElementById('resumoItens');

function formatarPreco(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Carrega o resumo do carrinho no lado direito
async function carregarResumo() {
  try {
    const resposta = await fetch(`${API_URL}/carrinho`, { credentials: 'include' });

    if (resposta.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    const dados = await resposta.json();

    if (dados.itens.length === 0) {
      resumoItens.innerHTML = '<p class="carregando">Carrinho vazio.</p>';
      formCheckout.querySelector('button').disabled = true;
      return;
    }

    resumoItens.innerHTML = `
      ${dados.itens.map(item => `
        <div class="resumo-item">
          <span>${item.quantidade}x ${item.nome}</span>
          <span>${formatarPreco(item.subtotal)}</span>
        </div>
      `).join('')}
      <div class="resumo-item resumo-total">
        <span>Total</span>
        <span>${formatarPreco(dados.total)}</span>
      </div>
    `;
  } catch (erro) {
    resumoItens.innerHTML = '<p class="carregando erro-texto">Não foi possível carregar o resumo.</p>';
  }
}

formCheckout.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const endereco = {
    rua: document.getElementById('rua').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    cep: document.getElementById('cep').value.trim()
  };

  const botao = formCheckout.querySelector('button');
  botao.disabled = true;
  botao.textContent = 'Confirmando...';
  mensagemDiv.textContent = '';
  mensagemDiv.className = 'mensagem';

  try {
    const resposta = await fetch(`${API_URL}/pedidos/finalizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ endereco })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagemDiv.textContent = dados.erro || 'Erro ao finalizar pedido.';
      mensagemDiv.classList.add('erro');
      botao.disabled = false;
      botao.textContent = 'Confirmar pedido';
      return;
    }

    window.location.href = `confirmacao.html?id=${dados.pedido.id}`;

  } catch (erro) {
    mensagemDiv.textContent = 'Não foi possível conectar ao servidor.';
    mensagemDiv.classList.add('erro');
    botao.disabled = false;
    botao.textContent = 'Confirmar pedido';
  }
});

carregarResumo();
