// Carrinhos guardados em memória, indexados por id de usuário — resetam ao reiniciar
let carrinhos = {}; // { usuarioId: [ { produtoId, quantidade } ] }

module.exports = {
  obter: (usuarioId) => carrinhos[usuarioId] || [],

  adicionar: (usuarioId, produtoId, quantidade) => {
    if (!carrinhos[usuarioId]) carrinhos[usuarioId] = [];
    const item = carrinhos[usuarioId].find(i => i.produtoId === produtoId);
    if (item) {
      item.quantidade += quantidade;
    } else {
      carrinhos[usuarioId].push({ produtoId, quantidade });
    }
    return carrinhos[usuarioId];
  },

  atualizarQuantidade: (usuarioId, produtoId, quantidade) => {
    if (!carrinhos[usuarioId]) return [];
    const item = carrinhos[usuarioId].find(i => i.produtoId === produtoId);
    if (item) item.quantidade = quantidade;
    return carrinhos[usuarioId];
  },

  remover: (usuarioId, produtoId) => {
    if (!carrinhos[usuarioId]) return [];
    carrinhos[usuarioId] = carrinhos[usuarioId].filter(i => i.produtoId !== produtoId);
    return carrinhos[usuarioId];
  },

  limpar: (usuarioId) => {
    carrinhos[usuarioId] = [];
  }
};
