const debug = require('debug')('SQL:log');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  // {
  //   connectionString: process.env.DATABASE_URL,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
);

module.exports = {

  originalClient: pool,

  async query(...args) {
    debug(...args);

    return this.originalClient.query(...args);
  },

};
