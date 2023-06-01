const { poke } = require('../../../models');

const CacheServer = require('../../../utils/cache');
const preformatPokemon = require('../../../utils/pokemon.utils/preformatePokemon');
const getPokemonFromCache = require('../../../utils/pokemon.utils/getPokemonFromCahe');
const { ApiError } = require('../../../helpers/errorHandler');

const cache = CacheServer.getInstance();
module.exports = {

  async getOne(req, res) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }

    if (getPokemonFromCache(id)) {
      return res.json(getPokemonFromCache(id));
    }
    try {
      const pokemon = await poke.findByPk(id);
      // if (!pokemon) then we redirect to seeding
      // if (!pokemon) throw new ApiError('no pokemon found', { statusCode: 404 });
      if (pokemon) {
        // we always return formated pokemon
        const formatedPokemon = await preformatPokemon(pokemon);
        return res.json(formatedPokemon);
      }

      return res.redirect(`/seeding/${id}`);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getOneByName(req, res) {
    const { name } = req.params;

    if (!name) throw new ApiError('name is required', { statusCode: 400 });
    try {
      const pokemon = await poke.findOneByName(name);
      if (!pokemon) throw new ApiError('no pokemon found baname', { statusCode: 404 });

      const formatedPokemon = await preformatPokemon(pokemon);
      return res.json(formatedPokemon);
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
    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }
    try {
      const pokemons = await poke.findAllByTypeId(id);

      if (pokemons) throw new ApiError('no pokemon found', { statusCode: 404 });
      const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return res.json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByTypesIds(req, res) {
    const { id1, id2 } = req.params;
    if (!id1 || !id2) {
      throw new ApiError('id1 and id2 are required', { statusCode: 400 });
    }
    try {
      const pokemons = await poke.findAllByTypesIds(id1, id2);
      if (!pokemons) throw new ApiError('no pokemon found', { statusCode: 404 });
      const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return res.status(200).json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getPokemonByGenId(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    try {
      const pokemons = await poke.findAllByGenId(id);
      if (!pokemons) throw new ApiError('no pokemon found', { statusCode: 404 });
      const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
      const allPokemons = await Promise.all(promises);
      if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return res.json(allPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getFullRandomTeam(_, res) {
    try {
      const randomIds = await poke.getRandomTeam();
      const promises = randomIds.map(async (id) => {
        if (cache.get(id.id)) return cache.get(id.id);
        const pokemon = await poke.findByPk(id.id);
        const formatedPokemon = await preformatPokemon(pokemon);
        return formatedPokemon;
      });
      const randomTeam = await Promise.all(promises);
      return res.json(randomTeam);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};