const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');

module.exports = class PokemonDatamapper extends CoreDatamapper {
  tablename = 'pokemon';

  /**
 * insert rows in the pokemon table we use an sql function to insert the data
 * the function allows us a better control of the data inserted and speed up the process
 * @param {object} pokemonData
 * @returns {Promise<object>} - The row inserted in the table
 */
  async insertPokemon(pokemonData) {
    const pokemon = await this.client.query(
      'SELECT * FROM insert_pokemon($1)',
      [pokemonData],
    );
    return pokemon.rows[0];
  }

  /**
 * retrieve 1 random row in the pokemon table
 * @returns {Promise<object>} - The row in the table
 */

  async findRandomOne() {
    const pokemon = await this.client.query(
      'SELECT id FROM pokemon ORDER BY RANDOM() LIMIT 1',
    );
    return pokemon.rows[0];
  }

  /**
   * retrieve pokemon with 1 type
   * @param {number} id
   * @returns {Promise<Array>} - The rows in the table
   */

  async findAllByTypeId(id) {
    const pokemons = await this.client.query(
      'SELECT * FROM pokemon WHERE type1 = $1 OR type2 = $1 ORDER BY id ASC',
      [id],
    );
    return pokemons.rows;
  }

  async findAllByTypeId1(id) {
    const query = 'SELECT * FROM pokemon WHERE type1 = $1 AND type2 IS NULL ORDER BY RANDOM() LIMIT 1';
    const values = [id];
    const response = await this.client.query(query, values);
    return response.rows[0];
  }

  /**
   * retrieve pokemon with 2 types
   * @param {number} id1
   * @param {number} id2
   * @returns {Promise<Array>} - The rows in the table
   */

  async findAllByTypesIds(id1, id2) {
    const pokemons = await this.client.query(
      'SELECT * FROM pokemon WHERE (type1 = $1 AND type2 = $2) OR (type1 = $2 AND type2 = $1) ORDER BY id ASC',

      [id1, id2],
    );
    return pokemons.rows;
  }

  /**
   * similar to findAllByTypesIds but with a random order and a limit of 1
   * @param {number} id
   * @param {number} id2
   * @returns {Promise<object>} - The row in the table
   */
  async findBestPokemonByTypesIds(id1, id2) {
    const pokemons = await this.client.query(
      'SELECT * FROM pokemon WHERE (type1 = $1 AND type2 = $2) OR (type1 = $2 AND type2 = $1) ORDER BY RANDOM() limit 1',

      [id1, id2],
    );
    return pokemons.rows[0];
  }

  /**
 * retrieve pokemon with 1 generation
 * @param {number} id
 * @returns {Promise<Array>} - The rows in the table
 */

  async findAllByGenId(id) {
    const pokemons = await this.client.query(
      'SELECT * FROM pokemon WHERE gen_id = $1 ORDER BY id ASC',
      [id],
    );
    return pokemons.rows;
  }

  /**
   * update multiple pokemon with their generation
   * @param {object} data
   * @returns {Promise<Array>} - The rows in the table
   */

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

  /**
   * retrive 6 random pokemon id
   * @returns {Promise<Array>} - The rows in the table
   */

  async getRandomTeam() {
    const randomIds = await this.client.query(

      'SELECT * FROM random_team()',
    );
    return randomIds.rows;
  }
};
