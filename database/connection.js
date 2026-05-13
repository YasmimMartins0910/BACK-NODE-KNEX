const knex = require('knex');
const config = require('../knexfile');

// Puxa a configuração de "development" do knexfile
const connection = knex(config.development);

module.exports = connection;


