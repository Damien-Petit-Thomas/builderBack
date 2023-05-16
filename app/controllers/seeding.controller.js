/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */

const buildPokemonFromPokeApi = require('../utils/pokemon.utils/buildPokemonFromPokeApi');
const { poke, type } = require('../models/index.datamapper');
const logger = require('../helpers/logger');
const CacheServer = require('../utils/cache');
const { gen } = require('../models/index.datamapper');
const { seedAllType, seedOneTypeById, seedAllPokemon } = require('../services/pokemon.service/seeding.service');

const cache = CacheServer.getInstance();

require('dotenv').config();

module.exports = {
//* method to seed one pokemon *//
  async seedOnePokemon(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const pokemonInCache = cache.get(id);
    if (pokemonInCache) {
      logger.info(`pokemon ${req.params.id} already exist in cache`);
      return res.json(pokemonInCache);
    }
    const pokemoon = await poke.findByPk(id);
    if (pokemoon) {
      logger.info(`pokemon ${req.params.id} already exist in db`);
      return res.json(pokemoon);
    }
    const { formatedPokemon, pokemon } = await buildPokemonFromPokeApi(id);
    const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
    cache.set(pokeSavedInDb.id, pokemon, this.TTL);
    return res.json(pokemon);
  },

  //* method to seed all pokemon *//

  async seedAllPokemon(req, res) {
    const allPokemonData = await seedAllPokemon();
    return res.json(allPokemonData);
  },

  async seedOneType(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const typ = await type.findByPk(id);
    if (typ) {
      logger.info(`type ${req.params.id} already exist in db`);
      return res.json(typ);
    }
    const typeData = await seedOneTypeById(id);
    return res.json(typeData);
  },

  async  seedTypes(_, res) {
    const types = await seedAllType();
    return res.json(types);
  },
  async getGenerations(_, res) {
    let numberOfGenerations;
    try {
      numberOfGenerations = await getAllGenerations();
      const start = await gen.count();
      const generations = await gen.insertGen(start + 1, numberOfGenerations);
      logger.log(generations);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    return res.json(numberOfGenerations);
  },

  //* method to get all association between pokemon and generation
  //* and insert them in the database (only for seeding purpose)

  async seedGen_idColumn() {
    const generations = await gen.findAll();
    const pokemons = [];
    const records = [];
    for (let i = 0; i < generations.length; i += 1) {
      pokemons[i] = await pokeApi.getAllPokeByGeneration(generations[i].id);
      for (let j = 0; j < pokemons[i].length; j += 1) {
        records.push({
          poke_id: pokemons[i][j].url.split('/')[6], gen_id: i + 1,
        });
      }
    }
    const response = poke.updatePokemonGen(records);
    return response;
  },
};
