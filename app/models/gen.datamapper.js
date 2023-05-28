const CoreDatamapper = require('./core.datamapper');

module.exports = class GenDatamapper extends CoreDatamapper {
  tablename = 'gen';

  /**
 * insert rows in the gen table
 * @param {number} start
 * @param {number} end
 * @returns {Promise<Array>} - The rows inserted in the table
 */

  async insertGen(start, end) {
    const response = await this.client.query(
      'SELECT * FROM gen_id($1, $2)',
      [start, end],
    );
    return response.rows;
  }
};
