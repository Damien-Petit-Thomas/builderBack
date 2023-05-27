/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */

const buildPokemonFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const { poke, type } = require('../../models/index.datamapper');
const logger = require('../../helpers/logger');
const CacheServer = require('../../utils/cache');
const { gen } = require('../../models/index.datamapper');
const { seedAllType, seedOneTypeById, seedAllPokemon } = require('../../services/pokemon.service/seeding.service');
const { ApiError } = require('../../helpers/errorHandler');
const { pokeApi } = require('../../services/pokemon.service');

const cache = CacheServer.getInstance();

require('dotenv').config();

module.exports = {

  async seedOnePokemon(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError('id is required', { statuscode: 400 });
    }
    const pokemonInCache = cache.get(id);
    if (pokemonInCache) {
      return res.json(pokemonInCache);
    }

    try {
      const pokemoon = await poke.findByPk(id);
      if (pokemoon) {
        return res.json(pokemoon);
      }
      const { formatedPokemon, pokemon } = await buildPokemonFromPokeApi(id);
      const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
      cache.set(pokeSavedInDb.id, pokemon, this.TTL);
      return res.json(pokemon);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  },

  async seedAllPokemon(req, res) {
    try {
      const allPokemonData = await seedAllPokemon();
      return res.json(allPokemonData);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  },

  async seedOneType(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    try {
      const typ = await type.findByPk(id);
      if (typ) {
        return res.json(typ);
      }
      const typeData = await seedOneTypeById(id);
      return res.json(typeData);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  },

  async  seedTypes(_, res) {
    try {
      const types = await seedAllType();
      return res.json(types);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  },

  async seedGenerations(_, res) {
    let numberOfGenerations;
    try {
      numberOfGenerations = await pokeApi.getAllGenerationsCount();
      const start = await gen.count();
      const generations = await gen.insertGen(start + 1, numberOfGenerations);
      return res.json(generations);
    } catch (err) {
      throw new ApiError('something went wrong', { statusCode: 500 });
    }
  },

  //! Method only here because of change in the db schema now all pokemon have a gen_id column

  async seedGen_idColumn() {
    const generations = await gen.findAll();
    // we get the generations from the db
    const pokemons = [];
    const records = [];
    // at each iteration we get all the pokemons from one generation
    // and we push them in the pokemons array
    // we take the poke_id from the url and the gen_id from the iteration
    for (let i = 0; i < generations.length; i += 1) {
      pokemons[i] = await pokeApi.getAllPokeByGeneration(generations[i].id);
      for (let j = 0; j < pokemons[i].length; j += 1) {
        records.push({
          poke_id: pokemons[i][j].url.split('/')[6], gen_id: i + 1,
        });
      }
    }
    // we update the gen_id column in the db
    const response = poke.updatePokemonGen(records);
    return response;
  },
};
