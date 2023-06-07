const CoreDatamapper = require('./core.datamapper');

module.exports = class PokemonHasAbilityDatamapper extends CoreDatamapper {
  tablename = 'pokemon_ability';

  async insertPokemonHasAbility(data) {
    let counter = 1;
    const parameters = [];
    const values = [];
    data.forEach((item) => {
      parameters.push(`($${counter}, $${counter + 1})`);
      counter += 2;
      values.push(item.poke_id, item.abi_id);
    });
    const query = `
    INSERT INTO ${this.tablename} (pokemon_id, ability_id)
     VALUES ${parameters.join(', ')} RETURNING *`;
    const pokemonHasAbility = await this.client.query(query, values);
    return pokemonHasAbility.rows;
  }
};
