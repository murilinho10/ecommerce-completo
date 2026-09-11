# E-commerce (Fase 1 — Produtos)

Projeto de e-commerce simples, sem banco de dados: os dados vivem em memória no servidor Node.js e resetam a cada reinício.

## Fases concluídas

**Fase 1 — Produtos**
- Catálogo de 10 produtos fixos (eletrônicos)
- Página de listagem (`index.html`) e página de detalhe (`produto.html`)
- Backend expõe `/api/produtos` (lista, com filtro opcional `?categoria=`) e `/api/produtos/:id`

**Fase 2 — Autenticação (em memória)**
- Cadastro e login com JWT em cookie HttpOnly, senha com bcrypt
- Usuários guardados em array em memória (resetam ao reiniciar o servidor)
- Cabeçalho mostra "Entrar / Criar conta" ou "Olá, [nome] / Sair" dependendo do estado de login

**Fase 3 — Carrinho**
- Carrinho vinculado ao usuário logado (guardado em memória, indexado por id de usuário)
- Só usuários logados podem adicionar ao carrinho — botão redireciona para login se necessário
- Página `carrinho.html`: ajustar quantidade, remover item, ver total
- Backend valida estoque disponível antes de adicionar

**Fase 4 — Checkout e Pedidos**
- Checkout simulado: formulário de endereço, sem gateway de pagamento real
- Ao confirmar: cria o pedido, reduz o estoque, limpa o carrinho
- Página de confirmação (`confirmacao.html`) e histórico em "Meus pedidos" (`pedidos.html`)
- Revalida estoque no momento do checkout (não só quando o item foi adicionado ao carrinho)

## Projeto completo
As 4 fases estão implementadas: catálogo → autenticação → carrinho → checkout/pedidos, todo o fluxo de compra funcional de ponta a ponta.

## Rodando local

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Sobe em `http://localhost:3001`.

### Frontend
Abre a pasta `frontend/` com o Live Server do VS Code, começando por `index.html`.

Confirma que `frontend/config.js` aponta para `http://localhost:3001/api`.

## Próximas melhorias possíveis (fora do escopo atual)
- Painel admin para gerenciar produtos
- Pagamento real (Stripe, Mercado Pago)
- Persistência real com banco de dados

## Limitação conhecida
Sem banco de dados, todos os dados (usuários, carrinhos, pedidos, quando implementados) somem sempre que o servidor reinicia. Isso é intencional para este projeto — não é indicado para uso real.
