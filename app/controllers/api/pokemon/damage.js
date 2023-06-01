const { poke, type } = require('../../../models');

const preformatPokemon = require('../../../utils/pokemon.utils/preformatePokemon');

const { ApiError } = require('../../../helpers/errorHandler');

// const cacheServer = require('../../../utils/cache');

const getPokemonFromCache = require('../../../utils/pokemon.utils/getPokemonFromCahe');

module.exports = {

  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    try {
      const types = await type.findNoDamageFrom(id);
      if (!types) throw new ApiError('no type found', { statusCode: 404 });
      const promises = types.map(async (typ) => {
        const pokemons = await poke.findAllByTypeId(typ.id);
        // todo cache verification
        // if (getPokemonFromCache(id)) {
        //   return res.json(getPokemonFromCache(id));
        // }
        const preformattedPokemons = await Promise.all(
          pokemons.map(async (pokemon) => preformatPokemon(pokemon)),
        );
        return preformattedPokemons;
      });

      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return res.json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    try {
      const types = await type.findHalfDamageFrom(id);
      if (!types) throw new ApiError('no type found', { statusCode: 404 });
      const promises = types.map(async (typ) => {
        const pokemons = await poke.findAllByTypeId(typ.id);
        const preformatePokemons = await Promise.all(
          pokemons.map(async (pokemon) => preformatPokemon(pokemon)),
        );
        return preformatePokemons;
      });
      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return res.json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getNoDamageFromOrHalfDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    try {
      const types = await type.findNoDamageFromAndHalfDamageFrom(id);
      if (!types) throw new ApiError('no type found', { statusCode: 404 });
      const promises = await types.map(async (typ) => {
        const pokemons = await poke.findAllByTypeId(typ.id);
        const preformatePokemons = await Promise.all(
          pokemons.map(async (pokemon) => preformatPokemon(pokemon)),
        );
        return preformatePokemons;
      });
      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return res.json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};
