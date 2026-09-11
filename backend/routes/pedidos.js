const express = require('express');
const router = express.Router();

const autenticar = require('../middleware/autenticar');
const carrinhosData = require('../data/carrinhos');
const produtosData = require('../data/produtos');
const pedidosData = require('../data/pedidos');

router.use(autenticar);

// Finalizar compra — cria o pedido a partir do carrinho atual
router.post('/finalizar', (req, res) => {
  const { endereco } = req.body;

  if (!endereco || !endereco.rua || !endereco.cidade || !endereco.cep) {
    return res.status(400).json({ erro: 'Endereço incompleto (rua, cidade e CEP são obrigatórios).' });
  }

  const itensCarrinho = carrinhosData.obter(req.usuarioId);

  if (itensCarrinho.length === 0) {
    return res.status(400).json({ erro: 'Carrinho vazio. Adicione produtos antes de finalizar.' });
  }

  // Revalida estoque de cada item antes de confirmar (pode ter mudado desde que foi adicionado)
  for (const item of itensCarrinho) {
    const produto = produtosData.buscarPorId(item.produtoId);
    if (!produto) {
      return res.status(400).json({ erro: `Produto ${item.produtoId} não existe mais.` });
    }
    if (produto.estoque < item.quantidade) {
      return res.status(400).json({ erro: `Estoque insuficiente para "${produto.nome}".` });
    }
  }

  // Monta os itens completos do pedido e reduz o estoque de cada um
  const itensPedido = itensCarrinho.map(item => {
    const produto = produtosData.buscarPorId(item.produtoId);
    produtosData.reduzirEstoque(item.produtoId, item.quantidade);
    return {
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: item.quantidade,
      subtotal: Number((produto.preco * item.quantidade).toFixed(2))
    };
  });

  const total = Number(itensPedido.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2));

  const pedido = pedidosData.criar({
    usuarioId: req.usuarioId,
    itens: itensPedido,
    total,
    endereco
  });

  carrinhosData.limpar(req.usuarioId);

  res.status(201).json({ mensagem: 'Pedido realizado com sucesso.', pedido });
});

// Listar meus pedidos
router.get('/', (req, res) => {
  res.json({ pedidos: pedidosData.listarPorUsuario(req.usuarioId) });
});

// Ver detalhe de um pedido específico
router.get('/:id', (req, res) => {
  const pedido = pedidosData.buscarPorId(req.params.id, req.usuarioId);
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado.' });
  }
  res.json({ pedido });
});

module.exports = router;
