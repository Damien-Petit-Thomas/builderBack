const CoreDatamapper = require('./core.datamapper');

module.exports = class AbilityDatamapper extends CoreDatamapper {
  tablename = 'ability';

  async insertAbility(abilityData) {
    const abi = await this.client.query(
      'SELECT * FROM insert_ability($1)',
      [abilityData],

    );
    return abi.rows[0];
  }
};
