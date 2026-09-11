const express = require('express');
const router = express.Router();

const autenticar = require('../middleware/autenticar');
const carrinhosData = require('../data/carrinhos');
const produtosData = require('../data/produtos');

// Monta a resposta do carrinho já com dados do produto e subtotal
function montarCarrinhoCompleto(usuarioId) {
  const itens = carrinhosData.obter(usuarioId);

  const itensCompletos = itens.map(item => {
    const produto = produtosData.buscarPorId(item.produtoId);
    if (!produto) return null;
    return {
      produtoId: produto.id,
      nome: produto.nome,
      imagem: produto.imagem,
      preco: produto.preco,
      quantidade: item.quantidade,
      subtotal: Number((produto.preco * item.quantidade).toFixed(2))
    };
  }).filter(Boolean);

  const total = Number(itensCompletos.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2));

  return { itens: itensCompletos, total };
}

// Todas as rotas do carrinho exigem login
router.use(autenticar);

// Ver carrinho
router.get('/', (req, res) => {
  res.json(montarCarrinhoCompleto(req.usuarioId));
});

// Adicionar produto ao carrinho
router.post('/adicionar', (req, res) => {
  const { produtoId, quantidade } = req.body;

  if (!produtoId || !quantidade || quantidade < 1) {
    return res.status(400).json({ erro: 'produtoId e quantidade (mínimo 1) são obrigatórios.' });
  }

  const produto = produtosData.buscarPorId(produtoId);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  if (produto.estoque < quantidade) {
    return res.status(400).json({ erro: 'Quantidade solicitada maior que o estoque disponível.' });
  }

  carrinhosData.adicionar(req.usuarioId, Number(produtoId), Number(quantidade));
  res.json(montarCarrinhoCompleto(req.usuarioId));
});

// Atualizar quantidade de um item
router.put('/:produtoId', (req, res) => {
  const { quantidade } = req.body;
  const produtoId = Number(req.params.produtoId);

  if (!quantidade || quantidade < 1) {
    return res.status(400).json({ erro: 'Quantidade deve ser no mínimo 1.' });
  }

  carrinhosData.atualizarQuantidade(req.usuarioId, produtoId, Number(quantidade));
  res.json(montarCarrinhoCompleto(req.usuarioId));
});

// Remover item do carrinho
router.delete('/:produtoId', (req, res) => {
  const produtoId = Number(req.params.produtoId);
  carrinhosData.remover(req.usuarioId, produtoId);
  res.json(montarCarrinhoCompleto(req.usuarioId));
});

module.exports = router;
