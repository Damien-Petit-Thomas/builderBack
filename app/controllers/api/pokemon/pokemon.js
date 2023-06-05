const formatPoke = require('../../../utils/pokemon.utils/dataMapToFormat');
const { poke } = require('../../../models');

const pokeCache = require('../../../utils/cache/pokemon.cache').getInstance();
const preformatPokemon = require('../../../utils/pokemon.utils/preformatePokemon');
const inCache = require('../../../utils/cache/inCache');
const { ApiError } = require('../../../helpers/errorHandler');
const logger = require('../../../helpers/logger');
// const pokeCache = CachePokemon.getInstance();
module.exports = {

  async getOne(req, res) {
    const { id } = req.params;
    const cache = inCache(id, pokeCache);

    if (cache) return res.json(cache);

    try {
      const pokemon = await poke.findByPk(id);
      if (!pokemon) throw new ApiError(` pokemon ${id} not found `, { statusCode: 500 });

      // we always return formated pokemon
      //! formatPoke wait for an array of pokemon
      const response = await formatPoke([pokemon]);
      return res.status(200).json(response[0]);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getByName(req, res) {
    const { name } = req.params;
    try {
      const pokemons = await poke.findOneByName(name);
      if (!pokemons) throw new ApiError(` pokemon ${name} not found `, { statusCode: 500 });
      const response = formatPoke(pokemons);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getAll(_, res) {
    try {
      const cache = inCache('all', pokeCache);
      if (cache) return res.json(cache);

      const pokemons = await poke.findAll();
      if (!pokemons.length === 0) throw new ApiError('no pokemon found', { statusCode: 404 });
      const response = await formatPoke(pokemons);
      pokeCache.set('all', response, pokeCache.TTL);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByTypeId(req, res) {
    try {
      const { id } = req.params;
      const cache = inCache(`pokeType${id}`, pokeCache);
      if (cache) return res.json(cache);

      const pokemons = await poke.findAllByTypeId(id);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });

      const response = await formatPoke(pokemons, res);
      pokeCache.set(`pokeType${id}`, response, pokeCache.TTL);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByTypesIds(req, res) {
    const { id1, id2 } = req.params;
    try {
      const pokemons = await poke.findAllByTypesIds(id1, id2);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });
      const response = await formatPoke(pokemons, res);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByGenId(req, res) {
    const { id } = req.params;
    const cache = inCache(`gen${id}`, pokeCache);
    if (cache) return res.json(cache);
    try {
      const pokemons = await poke.findAllByGenId(id);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });
      const response = await formatPoke(pokemons, res);
      pokeCache.set(`gen${id}`, response, pokeCache.TTL);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getFullRandomTeam(_, res) {
    try {
      const pokemons = await poke.getRandomTeam();
      const response = await formatPoke(pokemons, res);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
