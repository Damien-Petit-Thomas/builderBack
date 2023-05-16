const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');

module.exports = class PokemonDatamapper extends CoreDatamapper {
  tablename = 'pokemon';

  async insertPokemon(pokemonData) {
    // on a deja verifié que le pokemon n'existait pas

    const pokemon = await this.client.query(
      'SELECT * FROM insert_pokemon($1)',
      [pokemonData],
    );
    return pokemon.rows[0];
  }

  async findAllByTypeId(id) {
    const pokemons = await this.client.query(
      'SELECT * FROM pokemon WHERE type1 = $1 OR type2 = $1 ORDER BY id ASC',
      [id],
    );
    return pokemons.rows;
  }

  async findAllByGenId(id) {
    const pokemons = await this.client.query(
      'SELECT * FROM pokemon WHERE gen_id = $1 ORDER BY id ASC',
      [id],
    );
    return pokemons.rows;
  }

  async findNoDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT * FROM type WHERE damagefrom->>'${id}' = '0' `,

    );
    return pokemons.rows;
  }

  async findHalfDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT * FROM type WHERE damagefrom->>'${id}' = '0.5'`,

    );
    return pokemons.rows;
  }

  async findDoubleDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT * FROM type WHERE damagefrom->>'${id}' = '2'`,
    );
    return pokemons.rows;
  }

  async updatePokemonGen(data) {
    const query = `
      UPDATE pokemon p
      set gen_id = g.gen_id
      from (values ${data.map((item) => `(${item.poke_id}, ${item.gen_id})`).join(',')}) 
      as g(poke_id, gen_id)
      where p.id = g.poke_id
    `;
    try {
      const response = await this.client.query(query);
      return response.rows;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getRandomTeam() {
    // const randomTeam = await this.client.query(
    //   `
    // SELECT * FROM random_team()
    //     `,
    // );
    // return randomTeam.rows;
    const randomIds = await this.client.query(

      'SELECT id FROM random_team()',
    );
    return randomIds.rows;
  }
};
