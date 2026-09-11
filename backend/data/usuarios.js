// Usuários guardados em memória — resetam quando o servidor reinicia
let usuarios = [];
let proximoId = 1;

module.exports = {
  listarTodos: () => usuarios,
  buscarPorEmail: (email) => usuarios.find(u => u.email === email),
  buscarPorId: (id) => usuarios.find(u => u.id === Number(id)),
  criar: ({ nome, email, senhaHash }) => {
    const novoUsuario = { id: proximoId++, nome, email, senhaHash };
    usuarios.push(novoUsuario);
    return novoUsuario;
  }
};
