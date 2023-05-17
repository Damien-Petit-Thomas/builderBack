const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');

module.exports = class TypeDatamapper extends CoreDatamapper {
  tablename = 'type';

  async insertType(typeData) {
    // on verifie si le type existe deja dans la base de donnée
    const isExist = await this.client.query(
      'SELECT * FROM type WHERE id = $1',
      [typeData.id],
    );
    if (isExist.rows[0]) {
      logger.info(`type ${typeData.id} already exist`);
      return isExist.rows[0];
    }
    const type = await this.client.query(
      'SELECT * FROM insert_type($1)',
      [typeData],

    );
    return type.rows[0];
  }

  async findNoDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT *
      FROM type
      WHERE (
        SELECT COUNT(*)
        FROM json_array_elements(damagefrom::json) AS elem
        WHERE (elem->>'damage')::float = 0
          AND (elem->>'id')::int = $1
      ) > 0;
      ;
      `,
      [id],
    );

    return pokemons.rows;
  }

  async findHalfDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT *
      FROM type
      WHERE (
        SELECT COUNT(*)
        FROM json_array_elements(damagefrom::json) AS elem
        WHERE (elem->>'damage')::float = 0.5
          AND (elem->>'id')::int = $1
      ) > 0;
      ;
      `,
      [id],
    );

    return pokemons.rows;
  }

  async findNoDamageFromAndHalfDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT *
      FROM type
      WHERE (
        SELECT COUNT(*)
        FROM json_array_elements(damagefrom::json) AS elem
        WHERE (elem->>'damage')::float <= 0.5 
          AND (elem->>'id')::int = $1
      ) > 0;
      ;
      `,
      [id],
    );

    return pokemons.rows;
  }

  async findDoubleDamageFrom(id) {
    const pokemons = await this.client.query(
      `SELECT *
      FROM type
      WHERE (
        SELECT COUNT(*)
        FROM json_array_elements(damagefrom::json) AS elem
        WHERE (elem->>'damage')::float = 2
          AND (elem->>'id')::int = $1
      ) > 0;
      ;
      `,
      [id],
    );

    return pokemons.rows;
  }
};
