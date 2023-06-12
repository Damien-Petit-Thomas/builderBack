const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');

module.exports = class TypeDatamapper extends CoreDatamapper {
  tablename = 'team';

  async getTeamsByUserId(id) {
    const response = await this.client.query(
      `SELECT t.id, t.name , t.user_id, ARRAY_AGG(p.id) AS pokemon_id, ARRAY_AGG(p.name) AS pokemon_name
      FROM team AS t
      JOIN team_has_pokemon AS thp ON t.id = thp.team_id
      JOIN pokemon AS p ON thp.pokemon_id = p.id
      WHERE t.user_id =$1
      GROUP BY t.id, t.name , t.user_id`,
      [id],
    );
    return response.rows;
  }

  async getOneByName(name, userId) {
    const sql = `SELECT * FROM ${this.tablename} WHERE name = $1 AND user_id = $2`;
    const values = [name, userId];
    const result = await this.client.query(sql, values);
    return result.rows[0];
  }
};
