const CoreDatamapper = require('./core.datamapper');

module.exports = class TypeDatamapper extends CoreDatamapper {
  tablename = 'type';

  async insertType(typeData) {
    const isExist = await this.client.query(
      'SELECT * FROM type WHERE id = $1',
      [typeData.id],
    );
    if (isExist.rows[0]) {
      return isExist.rows[0];
    }
    const typ = await this.client.query(
      'SELECT * FROM insert_type($1)',
      [typeData],

    );
    return typ.rows[0];
  }

  async findNoDamageFrom(id) {
    const typ = await this.client.query(
      'SELECT * from findDamage($1, $2)',
      [id, 0],

    );

    return typ.rows;
  }

  async findHalfDamageFrom(id) {
    const typ = await this.client.query(
      'SELECT * from findDamage($1, $2)',
      [id, 0.5],

    );

    return typ.rows;
  }

  async findNoDamageFromAndHalfDamageFrom(id) {
    const typ = await this.client.query(
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

    return typ.rows;
  }

  async findDoubleDamageFrom(id) {
    const typ = await this.client.query(
      'SELECT * from findDamage($1, $2)',
      [id, 2],

    );

    return typ.rows;
  }

  async findResistanceToTypeList(resistTypeList, weakTypeList) {
    const typ = await this.client.query(
      'SELECT * FROM filterTypes($1 , $2) ;',
      [resistTypeList, weakTypeList],
    );
    return typ.rows;
  }
};
