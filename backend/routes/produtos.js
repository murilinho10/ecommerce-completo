const express = require('express');
const router = express.Router();
const produtosData = require('../data/produtos');

// Lista todos os produtos, com filtro opcional por categoria
router.get('/', (req, res) => {
  const { categoria } = req.query;
  let produtos = produtosData.listarTodos();

  if (categoria) {
    produtos = produtos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
  }

  res.json({ produtos });
});

// Busca um produto específico por id
router.get('/:id', (req, res) => {
  const produto = produtosData.buscarPorId(req.params.id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  res.json({ produto });
});

module.exports = router;
