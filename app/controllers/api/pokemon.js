/* eslint-disable no-await-in-loop */
require('dotenv').config();

const { poke } = require('../../models/index.datamapper');

const { type } = require('../../models/index.datamapper');

const CacheServer = require('../../utils/cache');
const preformatPokemon = require('../../utils/pokemon.utils/preformatePokemon');
const getPokemonFromCache = require('../../utils/pokemon.utils/getPokemonFromCahe');
const { getNumberOfResistanceByType } = require('../../utils/teamCompletion/getTeamWeakness');
const getTeamSuggestion = require('../../utils/teamCompletion/getTeamSuggestion');
const bestTwoTypes = require('../../utils/teamCompletion/bestTwoTypes');
const getBestPokemons = require('../../utils/teamCompletion/getBestPokemons');
const { ApiError } = require('../../helpers/errorHandler');

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
  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    try {
      const types = await type.findNoDamageFrom(id);
      if (!types) throw new ApiError('no type found', { statusCode: 404 });
      const promises = types.map(async (typ) => {
        const pokemons = await poke.findAllByTypeId(typ.id);
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

  async getTeamCompletion(req, res) {
    try {
      // The req.body contains an array with Pokemon IDs
      const poketeam = req.body;

      // Check if the array contains between 1 and 5 Pokemons
      if (poketeam.length < 1 || poketeam.length > 5) {
        throw new ApiError('Bad request : The team must contain between 1 and 5 pokemons', { statusCode: 400 });
      }

      // Check if all the Pokemons in the team are different
      if (new Set(poketeam).size !== poketeam.length) {
        throw new ApiError('Bad request : The team must contain different pokemons', { statusCode: 400 });
      }

      // Retrieve Pokemons from the database or cache and format them
      const promises = poketeam.map(async (id) => {
        const inCache = cache.get(id);
        if (inCache) return inCache;

        const inDb = await poke.findByPk(id);
        if (inDb) {
          const formatedPokemon = await preformatPokemon(inDb);
          return formatedPokemon;
        }

        throw new ApiError(` pokemon whith id  ${id} not found `, { statusCode: 404 });
      });

      const teamPokemons = (await Promise.all(promises)).flat();

      while (teamPokemons.length < 6) {
        const teamPokemonsIds = teamPokemons.map((pokemon) => pokemon.id);
        // retrieve the number resistance of the team to each type
        const weakNess = getNumberOfResistanceByType(teamPokemons);
        // get en array of the most weak type the length depend of the number of pokemon in the team
        const weak = getTeamSuggestion(weakNess, teamPokemons.length);
        //
        const typeList = weak.map((w) => w[0]);

        const resistantTypes = await type.findResistanceToTypeList(typeList);

        const bestTypes = bestTwoTypes(resistantTypes);

        const bestPokemons = await getBestPokemons(bestTypes, teamPokemonsIds);

        if (bestPokemons) {
          const formatedPokemon = await preformatPokemon(bestPokemons);
          teamPokemons.push(formatedPokemon);
        }
      }

      return res.json(teamPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};
