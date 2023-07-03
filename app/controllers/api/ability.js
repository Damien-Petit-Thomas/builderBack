const { aby } = require('../../models');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  async getAllAbilities(_, res) {
    const abilities = await aby.findAll();
    if (!abilities) throw new ApiError('an error accured while fetching data', { statusCode: 500 });
    return res.json(abilities);
  },

};
