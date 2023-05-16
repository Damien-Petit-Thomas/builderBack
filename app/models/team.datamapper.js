const CoreDatamapper = require('./core.datamapper');
const logger = require('../helpers/logger');
const { poke } = require('./index.datamapper');

module.exports = class TypeDatamapper extends CoreDatamapper {
  tablename = 'team';

  // async getRandomTeam() {
  // //   const randomTeam = await this.client.query(
  // //     `
  // // SELECT * FROM random_team()
  // //     `,
  // //   );
  // //   return randomTeam.rows;
  //   const randomIds = await this.client.query(

  //     'SELECT id FROM random_team()',
  //   );
  //   const ids = randomIds.rows.map((id) => id.id);
  //   const promises = ids.map(async (id) => {
  //     const pokemon = await poke.findByPk(id);
  //     return pokemon;
  //   });
  //   const randomTeam = await Promise.all(promises);
  //   return randomTeam;
  // }
};
