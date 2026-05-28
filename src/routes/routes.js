const express = require('express');
const router = express.Router();

const db = require('../../database/connection');

const bcrypt = require('bcrypt');

router.post('/novo-aluno', async (req, res) => {
  const { nome, idade, numero_chamada, senha } = req.body;

  if (!nome || !idade || !numero_chamada || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const saltRouds = 10;

  const hashSenha = await bcrypt.hash(senha, saltRouds);

  try {
    const [id] = await db('alunos').insert({
      nome,
      idade,
      numero_chamada,
      senha: hashSenha,
    });

    if (!id) {
      return res.status(400).json({ error: 'Erro ao cadastrar aluno' });
    }

    res
      .status(201)
      .json({
        messagem: 'Aluno cadastrado com sucesso',
        id,
        nome,
        idade,
        numero_chamada,
      });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
});

router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ error: 'Nome e senha sao obrigatorios' });
  }

  const usuario = await db('alunos').where({ nome }).first();

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario nao encontrado' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  res.json({
    message: 'Login bem-sucedido',
    id: usuario.id,
    nome: usuario.nome,
  });
});

router.get('/ping', (req, res) => {
  res.json({ message: 'ping' });
});

router.get('/alunos', async (req, res) => {
  try {
    const alunos = await db('alunos').select('*');

    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

router.post('/cadastrar-aluno', async (req, res) => {
  const { nome, idade, numero_chamada } = req.body;

  try {
    const [id] = await db('alunos').insert({ nome, idade, numero_chamada });

    if (!id) {
      return res.status(400).json({ error: 'Erro ao cadastrar aluno' });
    }

    res
      .status(201)
      .json({
        message: 'Aluno cadastrado com sucesso',
        id,
        nome,
        idade,
        numero_chamada,
      });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar alunos' });
  }
});

//buscar aluno por idade

//router.get('/aluno/:id', async (req, res) => {
//   const alunos = await db('alunos').select('*').where({ id }).first();
//});

router.get('/aluno/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const aluno = await db('alunos').where({ id }).first();

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// atualizar aluno

router.put('/aluno/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, numero_chamada } = req.body;

  try {
    const atualizado = await db('alunos')
      .where({ id })
      .update({ nome, idade, numero_chamada });

    if (!atualizado) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({
      message: 'Aluno atualizado com sucesso',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// deletar aluno

router.delete('/aluno/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletado = await db('alunos').where({ id }).del();

    if (!deletado) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({
      message: 'Aluno deletado com sucesso',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
});

module.exports = router;
