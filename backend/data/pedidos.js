// Pedidos guardados em memória — resetam ao reiniciar o servidor
let pedidos = [];
let proximoId = 1;

module.exports = {
  criar: ({ usuarioId, itens, total, endereco }) => {
    const novoPedido = {
      id: proximoId++,
      usuarioId,
      itens,
      total,
      endereco,
      status: 'confirmado',
      criadoEm: new Date().toISOString()
    };
    pedidos.push(novoPedido);
    return novoPedido;
  },

  listarPorUsuario: (usuarioId) => {
    return pedidos
      .filter(p => p.usuarioId === usuarioId)
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  },

  buscarPorId: (id, usuarioId) => {
    return pedidos.find(p => p.id === Number(id) && p.usuarioId === usuarioId);
  }
};
