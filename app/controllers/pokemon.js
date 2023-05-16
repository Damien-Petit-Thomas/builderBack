require('dotenv').config();

const logger = require('../helpers/logger');

const { poke } = require('../models/index.datamapper');
const seedOnePokemon = require('./seeding.controller');
const { type } = require('../models/index.datamapper');
const buildPokemonObjectFromPokeDb = require('../utils/pokemon.utils/buildFormatedPokemonFromDb');
const CacheServer = require('../utils/cache');
const preformatPokemon = require('../utils/pokemon.utils/preformatePokemon');
const getPokemonFromCache = require('../utils/pokemon.utils/getPokemonFromCahe');

const cache = CacheServer.getInstance();
module.exports = {

  async getOne(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    // on verifie si le pokemon est en cache
    if (getPokemonFromCache(id)) {
      return res.json(getPokemonFromCache(id));
    }
    // on verifie si le pokemon est en base de donnees
    const pokemon = await poke.findByPk(id);
    if (pokemon) {
      const formatedPokemon = await preformatPokemon(pokemon);
      return res.json(formatedPokemon);
    }

    return res.redirect(`/seeding/${id}`);
  },

  async getAll(req, res) {
    // on verifie si les pokemons sont en cache
    const pokemonsInCache = cache.get('all');
    if (pokemonsInCache) {
      logger.log('all pokemons already in cache');
      return res.json(pokemonsInCache);
    }
    const pokemons = await poke.findAll();
    const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));

    const allPokemons = await Promise.all(promises);

    // on stocke les pokemons en cache
    cache.set('all', allPokemons, this.TTL);
    logger.log('all pokemons added to cache');
    return res.json(allPokemons);
  },

  async getPokemonByTypeId(req, res) {
    const { id } = req.params;
    logger.log(id);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const pokemons = await poke.findAllByTypeId(id);
    return res.json(pokemons);
  },

  async getPokemonByGenId(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const pokemons = await poke.findAllByGenId(id);
    return res.json(pokemons);
  },

  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    const typeName = await type.findByPk(id);
    const imune = await poke.findNoDamageFrom(typeName.name);
    return res.json(imune);
  },
  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    const typeName = await type.findByPk(id);
    const resist = await poke.findHalfDamageFrom(typeName.name);
    return res.json(resist);
  },
  async getNoDamageFromAndHalfDamageFrom(req, res) {
    const { id } = req.params;
    const typeName = await type.findByPk(id);
    const imune = await poke.findNoDamageFrom(typeName.name);
    const resist = await poke.findHalfDamageFrom(typeName.name);
    const result = imune.concat(resist);
    return res.json(result);
  },
  async getDoubleDamageFrom(req, res) {
    const { id } = req.params;
    const typeName = await type.findByPk(id);
    const weak = await poke.findDoubleDamageFrom(typeName.name);
    return res.json(weak);
  },
  async getNoDamageFromAndHalfDamageFromToTypes(req, res) {
    const { typeId1, typeId2 } = req.params;
    const typeName1 = await type.findByPk(typeId1);
    const typeName2 = await type.findByPk(typeId2);
    const imune1 = await poke.findNoDamageFrom(typeName1.name);
    const imune2 = await poke.findNoDamageFrom(typeName2.name);
    const resist1 = await poke.findHalfDamageFrom(typeName1.name);
    const resist2 = await poke.findHalfDamageFrom(typeName2.name);
    const result = imune1.concat(imune2, resist1, resist2);
    return res.json(result);
  },
  async getOneByName(req, res) {
    const { name } = req.params;
    const pokemon = await poke.findOneByName(name);
    if (pokemon) {
      // on cree un tableau vide pour stocker les types
      logger.log(`pokemon ${name} already exist in db`);
      const pokemonType = [];
      pokemonType.push(pokemon.type1);
      if (pokemon.type2) {
        pokemonType.push(pokemon.type2);
      }

      // on recupere les données de degats pour chaque type
      const promises = pokemonType.map(async (typeId) => {
        const damage = await type.findByPk(typeId);
        return damage.damagefrom;
      });
      const totalDamage = await Promise.all(promises);
      const formatedPokemon = buildPokemonObjectFromPokeDb(pokemon, totalDamage);
      // on stocke le pokemon en cache
      cache.set(pokemon.id, formatedPokemon, this.TTL);
      logger.log(`pokemon ${req.params.id} added to cache`);
      return res.json(formatedPokemon);
    }

    return seedOnePokemon(req, res);
  },
  async getFullRandomTeam(_, res) {
    const randomIds = await poke.getRandomTeam();
    const promises = randomIds.map(async (id) => {
      if (cache.get(id.id)) return cache.get(id.id);
      const pokemon = await poke.findByPk(id.id);
      const formatedPokemon = await preformatPokemon(pokemon);
      return formatedPokemon;
    });
    const randomTeam = await Promise.all(promises);
    return res.json(randomTeam);
  },

  async getTeamCompletion(req, res) {
    // le req.body contient un tableau avec les ids des pokemons
    const poketeam = req.body;
    // on vérifie que le tableau contient entre 1 et 5 pokemons
    if (poketeam.length < 1 || poketeam.length > 5) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'The req body must contain between 1 and 5 pokemons',
      });
    }

    // on verifie que les pokemons sont tous différents
    if (new Set(poketeam).size !== poketeam.length) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'The req body must contain different pokemons',
      });
    }
    // on recupere les pokemons depuis la base de données
    const promises = poketeam.map(async (id) => {
      const inCache = cache.get(id);
      if (inCache) return inCache;
      const inDb = await poke.findByPk(id);
      if (inDb) {
        const formatedPokemon = await preformatPokemon(inDb);
        return res.json(formatedPokemon);
      }
      return res.status(400).json({
        error: 'Bad request',
        message: 'unknow pokemon',
      });
    });
    const teamPokemons = await Promise.all(promises);
    console.log(teamPokemons);
    return res.json(teamPokemons);
    // const suggestedTeam = await team.getSuggestedTeam(...pokemons);
    // return res.json(suggestedTeam);
  },
};
