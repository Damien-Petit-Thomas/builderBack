const debug = require('debug')('SQL:log');
const { Pool } = require('pg');

const pool = new Pool();

module.exports = {

  originalClient: pool,

  async query(...args) {
    debug(...args);

    return this.originalClient.query(...args);
  },

};
