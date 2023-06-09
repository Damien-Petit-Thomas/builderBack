const CoreDatamapper = require('./core.datamapper');

module.exports = class UserHasFavorite extends CoreDatamapper {
  tablename = 'user_has_favorite';

  async findOne(userId, pokemonId) {
    const sql = `SELECT * FROM ${this.tablename} WHERE user_id = $1 AND favorite_id = $2`;
    const values = [userId, pokemonId];
    const result = await this.client.query(sql, values);
    return result.rows[0];
  }

  async deleteOne(userId, pokemonId) {
    const sql = `DELETE FROM ${this.tablename} WHERE user_id = $1 AND favorite_id = $2 RETURNING *`;
    const values = [userId, pokemonId];
    const result = await this.client.query(sql, values);
    return result.rows[0];
  }

  async getFavoritesByUserId(userId) {
    const sql = `SELECT * FROM ${this.tablename} WHERE user_id = $1 ORDER BY favorite_id`;
    const values = [userId];
    const result = await this.client.query(sql, values);
    return result.rows;
  }
};
