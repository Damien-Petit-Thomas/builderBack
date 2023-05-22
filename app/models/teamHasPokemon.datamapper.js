const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');

module.exports = class TeamHasPokemon extends CoreDatamapper {
  tablename = 'team_has_pokemon';

  async insertTeam(pokemonIds, teamId) {
    const sql = `INSERT INTO ${this.tablename} (pokemon_id, team_id) VALUES `;
    const placeholders = pokemonIds.map((_, index) => `($${index + 1}, $${index + 2})`).join(', ');
    const values = pokemonIds.flatMap((id) => [id, teamId]);
    const query = {
      text: `${sql}${placeholders} RETURNING *`,
      values,
    };
    const response = await this.client.query(query);
    return response.rows;
  }
};
