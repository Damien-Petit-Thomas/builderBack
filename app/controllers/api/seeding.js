//* Purpose: seeding controller
const buildPokemonFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const {
  poke, type, gen, ability, pokeHasAbi,
} = require('../../models');
const logger = require('../../helpers/logger');
const pokeCache = require('../../utils/cache/pokemon.cache').getInstance();
const seed = require('../../services/pokemon.service/seeding.service');
const { ApiError } = require('../../helpers/errorHandler');
const { pokeApi } = require('../../services/pokemon.service');
const inCache = require('../../utils/cache/inCache');

require('dotenv').config();

module.exports = {

  async seedOnePokemon(req, res) {
    const { id } = req.params;
    const cache = inCache(id, pokeCache);
    if (cache) return res.json(cache);

    try {
      const pokemoon = await poke.findByPk(id);
      if (pokemoon) {
        return res.json(pokemoon);
      }

      const { formatedPokemon, pokemon } = await buildPokemonFromPokeApi(id);
      if (!formatedPokemon) throw new ApiError('No pokemon found to seed', { statusCode: 404 });
      const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
      cache.set(pokeSavedInDb.id, pokemon, cache.TTL);
      return res.json(pokemon);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async seedAllPokemon(req, res) {
    try {
      const allPokemonData = await seed.seedAllPokemon();
      if (!allPokemonData) throw new ApiError('No pokemon found to seed', { statusCode: 404 });
      return res.json(allPokemonData);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async seedOneType(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }

    try {
      const typ = await type.findByPk(id);
      if (typ) {
        return res.json(typ);
      }
      const typeData = await seed.seedOneTypeById(id);
      if (!typeData) throw new ApiError(`No type found with id ${id}`, { statusCode: 404 });
      return res.json(typeData);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async  seedTypes(_, res) {
    try {
      const types = await seed.seedAllType(res);
      if (!types) throw new ApiError('No types found to seed', { statusCode: 404 });
      return res.json(types);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async   seedOneAbilities(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }
    const { abiInDb, data } = await seed.seedOneAbilityById(id);

    if (!data) throw new ApiError(`No ability found with id ${id}`, { statusCode: 404 });
    const result = ability.insertAbility(abiInDb);
    return res.json(result);
  },

  async seedAbilities(_, res) {
    try {
      const abilities = await seed.seedAllAbilities();
      if (!abilities) throw new ApiError('No ability found to seed', { statusCode: 400 });
      return res.json(abilities);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async seedPokemonHasAbility(_, res) {
    try {
      const data = await seed.seedPokemonAbility();

      const maxPokeId = data.reduce((max, item) => {
        const pokeId = parseInt(item.poke_id, 10);
        return pokeId > max ? pokeId : max;
      }, 0);
      const maxAbiId = data.reduce((max, item) => {
        const abiId = parseInt(item.abi_id, 10);
        return abiId > max ? abiId : max;
      }, 0);

      console.log(`====================${maxPokeId}==============================`);
      console.log(`====================${maxAbiId}==============================`);
      const response = await pokeHasAbi.insertPokemonHasAbility(data);
      if (!response) throw new ApiError('No pokemon ability found to seed', { statusCode: 404 });
      return res.json(response);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async seedGenerations(_, res) {
    let numberOfGenerations;
    try {
      numberOfGenerations = await pokeApi.getAllGenerationsCount();
      const start = await gen.count();
      const generations = await gen.insertGen(start + 1, numberOfGenerations);
      if (!generations) throw new ApiError('No generations found to seed', { statusCode: 404 });
      return res.json(generations);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  //! Method only here because of change in the db schema now all pokemon have a gen_id column

  async seedGen_idColumn() {
    try {
      const generations = await gen.findAll();
      if (!generations) throw new ApiError('No generations found to seed', { statusCode: 404 });
      // we get the generations from the db
      // at each iteration we get all the pokemons from one generation
      // and we push them in the pokemons array
      const promises = generations.map(async (generation, i) => {
        const pokemons = await pokeApi.getAllPokeByGeneration(generation.id);
        const records = pokemons.map((pokemon) => ({
          poke_id: pokemon.url.split('/')[6],
          gen_id: i + 1,
        }));
        return records;
      });
      const allRecords = (await Promise.all(promises)).flat();

      const responses = await poke.updatePokemonGen(allRecords);

      if (responses.some((response) => !response)) {
        throw new ApiError('An error occurred while seeding the gen_id column', { statusCode: 404 });
      }

      return responses;
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },
};
