const CoreDatamapper = require('./core.datamapper');

module.exports = class GenDatamapper extends CoreDatamapper {
  tablename = 'gen';

  async count() {
    const count = await this.client.query(
      `SELECT COUNT(*) FROM ${this.tablename}`,
    );
    return Number(count.rows[0].count);
  }

  async insertGen(start, end) {
    const response = await this.client.query(
      'SELECT * FROM gen_id($1, $2)',
      [start, end],
    );
    return response.rows;
  }
};
