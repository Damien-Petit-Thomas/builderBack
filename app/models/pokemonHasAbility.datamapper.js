const CoreDatamapper = require('./core.datamapper');

module.exports = class PokemonHasAbilityDatamapper extends CoreDatamapper {
  tablename = 'pokemon_ability';

  async insertPokemonHasAbility(data) {
    const sql = `INSERT INTO ${this.tablename} (pokemon_id, ability_id) VALUES`;
    const placeholders = data.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
    const values = data.flatMap((item) => [Number(item.poke_id), item.abi_id]);
    const query = {
      text: `${sql}${placeholders} RETURNING *`,
      values,
    };

    const response = await this.client.query(query);
    return response.rows;
  }
};
