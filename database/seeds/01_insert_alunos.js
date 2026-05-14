/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('alunos').del();
  await knex('alunos').insert([
    { nome: 'Aluno 1', idade: 20, numero_chamada: 1 },
    { nome: 'Aluno 2', idade: 21, numero_chamada: 2 },
    { nome: 'Aluno 3', idade: 22, numero_chamada: 3 },
  ]);
};
