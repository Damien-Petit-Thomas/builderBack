const formatPoke = require('../../../utils/pokemon.utils/dataMapToFormat');
const { poke } = require('../../../models');

const CachePokemon = require('../../../utils/cache/pokemon.cache');
const preformatPokemon = require('../../../utils/pokemon.utils/preformatePokemon');
const inCache = require('../../../utils/pokemon.utils/getPokemonFromCahe');
const { ApiError } = require('../../../helpers/errorHandler');
const { seedOnePokemon } = require('../seeding');

const cache = CachePokemon.getInstance();
module.exports = {

  async getOne(req, res) {
    const { id } = req.params;

    if (inCache(id)) return res.json(inCache(id));
    try {
      const pokemon = await poke.findByPk(id);

      if (pokemon) {
        // we always return formated pokemon
        const formatedPokemon = await preformatPokemon(pokemon);
        return res.json(formatedPokemon);
      }
      return seedOnePokemon(req, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getByName(req, res) {
    const { name } = req.params;
    try {
      const pokemons = await poke.findOneByName(name);
      if (!pokemons) throw new ApiError(` pokemon ${name} not found `, { statusCode: 500 });
      return formatPoke(pokemons, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getAll(_, res) {
    const pokemonsInCache = cache.get('all');
    if (pokemonsInCache) {
      return res.json(pokemonsInCache);
    }
    try {
      const pokemons = await poke.findAll();
      if (!pokemons.length === 0) throw new ApiError('no pokemon found', { statusCode: 404 });
      const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));

      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      // Let's take this opportunity to cache  them all with the key 'all'
      cache.set('all', allPokemons, cache.TTL);

      return res.json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByTypeId(req, res) {
    const { id } = req.params;
    try {
      const pokemons = await poke.findAllByTypeId(id);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });
      return formatPoke(pokemons, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByTypesIds(req, res) {
    const { id1, id2 } = req.params;
    try {
      const pokemons = await poke.findAllByTypesIds(id1, id2);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });
      return formatPoke(pokemons, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByGenId(req, res) {
    const { id } = req.params;
    try {
      const pokemons = await poke.findAllByGenId(id);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });
      return formatPoke(pokemons, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getFullRandomTeam(_, res) {
    try {
      const pokemons = await poke.getRandomTeam();
      return formatPoke(pokemons, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
