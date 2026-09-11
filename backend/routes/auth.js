const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const usuariosData = require('../data/usuarios');
const autenticar = require('../middleware/autenticar');

const SALT_ROUNDS = 12;

function senhaEhForte(senha) {
  return typeof senha === 'string' && senha.length >= 8 && /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha);
}

function gerarTokenECookie(res, usuarioId) {
  const token = jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// ---------- CADASTRO ----------
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    if (!senhaEhForte(senha)) {
      return res.status(400).json({ erro: 'Senha deve ter no mínimo 8 caracteres, com letras e números.' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    if (usuariosData.buscarPorEmail(emailNormalizado)) {
      return res.status(409).json({ erro: 'Já existe uma conta com este email.' });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const novoUsuario = usuariosData.criar({ nome: nome.trim(), email: emailNormalizado, senhaHash });

    gerarTokenECookie(res, novoUsuario.id);

    return res.status(201).json({
      mensagem: 'Conta criada com sucesso.',
      usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email }
    });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    return res.status(500).json({ erro: 'Erro interno ao criar conta.' });
  }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const emailNormalizado = email.toLowerCase().trim();
    const usuario = usuariosData.buscarPorEmail(emailNormalizado);

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    gerarTokenECookie(res, usuario.id);

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
});

// ---------- LOGOUT ----------
   router.post('/logout', (req, res) => {
     res.clearCookie('token', {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
     });
     return res.json({ mensagem: 'Logout realizado.' });
   });

// ---------- QUEM SOU EU ----------
router.get('/eu', autenticar, (req, res) => {
  const usuario = usuariosData.buscarPorId(req.usuarioId);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }
  return res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});

module.exports = router;
