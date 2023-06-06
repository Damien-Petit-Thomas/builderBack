const CoreDatamapper = require('./core.datamapper');

module.exports = class AbilityDatamapper extends CoreDatamapper {
  tablename = 'ability';

  async insertAbility(abilityData) {
    const isExist = await this.client.query(
      'SELECT * FROM type WHERE id = $1',
      [abilityData.id],
    );
    if (isExist.rows[0]) {
      return isExist.rows[0];
    }
    const abi = await this.client.query(
      'SELECT * FROM insert_ability($1)',
      [abilityData],

    );
    return abi.rows[0];
  }
};
