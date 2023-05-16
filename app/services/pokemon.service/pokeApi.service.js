/* eslint-disable no-await-in-loop */
const CoreService = require('./core.service');
const logger = require('../../helpers/logger');

module.exports = class PokemonService extends CoreService {
  //* method to get the pokemon stats types id ...   *//
// endpoint : https://pokeapi.co/api/v2/pokemon/{id || name}/

  async getPokemonData(nameOrId) {
    try {
      const response = await this.get(`/pokemon/${nameOrId}`);
      return response;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  //* method to get the number of existing generation  *//
  // endpoint : https://pokeapi.co/api/v2/generation/

  async getAllGenerations() {
    try {
      const response = await this.get('/generation');
      return response.count;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  //* method to get all pokemon of a generation by generation id  *//
  // endpoint : https://pokeapi.co/api/v2/generation/{id}/

  async getAllPokeByGeneration(id) {
    try {
      const response = await this.get(`/generation/${id}`);
      return response.pokemon_species;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  //* method to get the french name and generation of a pokemon by pokemon id  *//
  // endpoint : https://pokeapi.co/api/v2/pokemon-species/{id}/

  async getFrenchName(id) {
    try {
      const response = await this.get(`/pokemon-species/${id}`);
      const frenchName = response.names.find((name) => name.language.name === 'fr').name;
      const gen = response.generation.url.split('/')[6];
      console.log(gen);
      return { frenchName, gen };
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  //* method to get the type data by type name  *//
  // endpoint : https://pokeapi.co/api/v2/type/{name}/

  async getTypeData(typeNameORId) {
    try {
      const response = await this.get(`/type/${typeNameORId}`);

      return response;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  //* method to get all existing types   *//
  // endpoint : https://pokeapi.co/api/v2/type/

  async getAllTypes() {
    try {
      const response = await this.get('/type/');

      return response.results;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  //* methode to get  data for all types and stock them in 3
  //* differents arrays   to use them in the controller  for the seed

  async getAllTypesData() {
    try {
      const types = await this.getAllTypes();
      const damages = [];
      const frenchType = [];
      const englishName = [];
      for (let i = 1; i < types.length - 1; i += 1) {
        const typeData = await this.getTypeData(i);
        damages.push(typeData.damage_relations);
        frenchType.push(typeData.names.find((name) => name.language.name === 'fr'));
        englishName.push(types[i - 1].name);
      }
      return { damages, frenchType, englishName };
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
};
