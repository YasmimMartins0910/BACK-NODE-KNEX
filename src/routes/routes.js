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

module.exports = router;

//{
//   "nome": 'Yasmim',
//   "idade": 31,
//   "numero_chamada": 98797
//}

//localhost:3000/cadastrar-aluno

//https://reqbin.com
