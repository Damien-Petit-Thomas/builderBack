const CacheServer = require('../../utils/cache');

const cache = CacheServer.getInstance();
const { poke } = require('../../models/index.datamapper');
const logger = require('../../helpers/logger');
const preformatPokemon = require('../../utils/pokemon.utils/preformatePokemon');

module.exports = {

  async cacheAllPokemon() { // set in cache by id all pokemon from 1 to 1010
    for (let i = 1; i <= 1010; i += 1) {
      if (!cache.get(i)) {
        const pokemon = await poke.findByPk(i);
        if (pokemon) {
          const formatedPokemon = await preformatPokemon(pokemon);
          cache.set(i, formatedPokemon);
          logger.log(`pokemon ${i} saved in cache`);
        } else {
          logger.log(`pokemon ${i} not found in db`);
        }
      }
    }
  },
};
