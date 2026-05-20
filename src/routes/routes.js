const express = require('express');
const router = express.Router();

const db = require('../../database/connection');

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
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

  const aluno = {
    nome,
    idade,
    numero_chamada,
  };

  try {
    const [id] = await db('alunos').insert(aluno);

    if (!id) {
      return res.status(400).json({ error: 'Erro ao cadastrar aluno' });
    }

    res.status(201).json({
      message: 'Aluno cadastrado com sucesso',
      id,
      nome,
      idade,
      numero_chamada,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
});

// buscar aluno por id
router.get('/aluno/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const aluno = await db('alunos').select('*').where({ id }).first();

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    return res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// atualizar aluno
router.put('/aluno/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, numero_chamada } = req.body;

  if (!nome || !idade || !numero_chamada) {
    return res.status(400).json({
      error: 'TODOS OS CAMPOS SÃO OBRIGATÓRIOS',
    });
  }

  const aluno = {
    nome,
    idade,
    numero_chamada,
  };

  try {
    const alunoExiste = await db('alunos').where({ id }).first();

    if (!alunoExiste) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    await db('alunos').where({ id }).update(aluno);

    res.json({
      message: 'Aluno atualizado com sucesso',
      id,
      nome,
      idade,
      numero_chamada,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

//deletar aluno
router.delete('/aluno/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const alunoExiste = await db('alunos').where({ id }).first();

    if (!alunoExiste) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    await db('alunos').where({ id }).delete();

    res.json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
});

module.exports = router;

//{
//   "nome": 'Yasmim',
//   "idade": 31,
//   "numero_chamada": 98797
//}

//localhost:3000/cadastrar-aluno

//https://reqbin.com
