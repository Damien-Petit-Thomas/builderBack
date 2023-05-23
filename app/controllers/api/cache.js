const { cacheAllPokemon } = require('../../services/pokemon.service/cache.service');

module.exports = {

  async getAll(_, res) {
    const response = await cacheAllPokemon();
    return res.json(response);
  },
};
