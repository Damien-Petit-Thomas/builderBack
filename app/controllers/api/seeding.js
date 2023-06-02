const buildPokemonFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const { poke, type, gen } = require('../../models');
const logger = require('../../helpers/logger');
const CachePokemon = require('../../utils/cache/pokemon.cache');
const { seedAllType, seedOneTypeById, seedAllPokemon } = require('../../services/pokemon.service/seeding.service');
const { ApiError } = require('../../helpers/errorHandler');
const { pokeApi } = require('../../services/pokemon.service');
const inCache = require('../../utils/pokemon.utils/getPokemonFromCahe');

const cache = CachePokemon.getInstance();

require('dotenv').config();

module.exports = {

  async seedOnePokemon(req, res) {
    const { id } = req.params;

    if (inCache(id)) return res.json(inCache(id));

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
      const allPokemonData = await seedAllPokemon();
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
      const typeData = await seedOneTypeById(id);
      if (!typeData) throw new ApiError(`No type found with id ${id}`, { statusCode: 404 });
      return res.json(typeData);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async  seedTypes(_, res) {
    try {
      const types = await seedAllType();
      if (!types) throw new ApiError('No types found to seed', { statusCode: 404 });
      return res.json(types);
    } catch (err) {
      logger.error(err);
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
