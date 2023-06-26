const formatPoke = require('../../../utils/pokemon.utils/dataMapToFormat');
const {
  poke, pokeHasAbi, aby,
} = require('../../../models');

const pokeCache = require('../../../utils/cache/pokemon.cache').getInstance();
const inCache = require('../../../utils/cache/inCache');
const { ApiError } = require('../../../helpers/errorHandler');
const logger = require('../../../helpers/logger');
const { cacheOrFormatPokemon: getPokemon } = require('../../../utils/pokemon.utils/cacheOrFormatPokemon');

const redis = require('../../../utils/cache/redisCache');
// const pokeCache = CachePokemon.getInstance();
module.exports = {

  async getOne(req, res) {
    const { id } = req.params;
    const pokemon = await getPokemon(id, pokeCache);
    return res.status(200).json(pokemon);
  },

  async getByName(req, res) {
    const { name } = req.params;
    try {
      const pokemons = await poke.findOneByName(name);

      if (!pokemons) throw new ApiError(` pokemon ${name} not found `, { statusCode: 500 });
      const response = await formatPoke(pokemons);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getAll(_, res) {
    try {
      const coucou = await redis.get('all');
      if (coucou) return res.json(JSON.parse(coucou));
      // const cache = inCache('all', pokeCache);
      // if (cache) return res.json(cache);
      console.log('not in cache');
      const pokemons = await poke.findAll();
      if (!pokemons.length === 0) throw new ApiError('no pokemon found', { statusCode: 404 });
      const response = await formatPoke(pokemons);
      redis.set('all', JSON.stringify(response));
      // pokeCache.set('all', response, pokeCache.TTL);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByTypeId(req, res) {
    try {
      const { id } = req.params;
      const redisCache = await redis.get(`pokeType/${id}`);
      if (redisCache) return res.json(JSON.parse(redisCache));
      // const cache = inCache(`pokeType/${id}`, pokeCache);
      // if (cache) return res.json(cache);

      const pokemons = await poke.findAllByTypeId(id);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });

      const response = await formatPoke(pokemons);
      redis.set(`pokeType/${id}`, JSON.stringify(response));
      // pokeCache.set(`pokeType/${id}`, response, pokeCache.TTL);
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
      const response = await formatPoke(pokemons);
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
      const response = await formatPoke(pokemons);
      pokeCache.set(`gen${id}`, response, pokeCache.TTL);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByAbilityId(req, res) {
    const { id } = req.params;

    const cache = inCache(`abi${id}`, pokeCache);
    if (cache) return res.json(cache);
    try {
      const pokemons = await pokeHasAbi.findAllByAbilityId(id);
      if (!pokemons) throw new ApiError('a problem occured while fetching pokemons', { statusCode: 404 });
      const promises = pokemons.map(async (pokemon) => {
        const pokeData = await poke.findByPk(pokemon.pokemon_id);
        return pokeData;
      });
      const allPokemon = await Promise.all(promises);
      const response = await formatPoke(allPokemon);
      pokeCache.set(`abi${id}`, response, pokeCache.TTL);
      return res.status(200).json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getAbilitiesByPokemonId(req, res) {
    const { id } = req.params;
    try {
      const pokemon = await poke.findByPk(id);

      if (!pokemon) throw new ApiError(` pokemon ${id} not found `, { statusCode: 500 });
      const pokemonData = await formatPoke([pokemon]);
      const abilities = await pokeHasAbi.findAllByPokemmonId(pokemonData[0].id);
      const promises = abilities.map(async (ability) => {
        const abilityData = await aby.findByPk(ability.ability_id);
        return abilityData;
      });
      const allAbility = await Promise.all(promises);
      pokemonData[0].abilities = allAbility;

      return res.status(200).json(pokemonData[0]);
    } catch (err) {
      throw new ApiError(err.message, err.info);
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
