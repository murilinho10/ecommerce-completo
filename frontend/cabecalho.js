async function montarCabecalho() {
  const areaConta = document.getElementById('areaConta');
  if (!areaConta) return;

  try {
    const resposta = await fetch(`${API_URL}/auth/eu`, { credentials: 'include' });

    if (!resposta.ok) {
      areaConta.innerHTML = `
        <a href="login.html" class="link-conta">Entrar</a>
        <a href="cadastro.html" class="link-conta">Criar conta</a>
      `;
      return;
    }

    const dados = await resposta.json();
    areaConta.innerHTML = `
      <a href="pedidos.html" class="link-conta">Meus pedidos</a>
      <a href="carrinho.html" class="link-conta">Carrinho</a>
      <span class="nome-usuario">Olá, ${dados.usuario.nome}</span>
      <button id="botaoSair" class="link-conta botao-link">Sair</button>
    `;

    document.getElementById('botaoSair').addEventListener('click', async () => {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      window.location.reload();
    });

  } catch (erro) {
    areaConta.innerHTML = `
      <a href="login.html" class="link-conta">Entrar</a>
      <a href="cadastro.html" class="link-conta">Criar conta</a>
    `;
  }
}

montarCabecalho();
