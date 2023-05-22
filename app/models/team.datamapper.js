const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');

module.exports = class TypeDatamapper extends CoreDatamapper {
  tablename = 'team';

  async getTeamsByUserId(id) {
    const response = await this.client.query(
      `SELECT * FROM ${this.tablename} WHERE user_id = $1`,
      [id],
    );
    return response.rows;
  }
};
