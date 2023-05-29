/* eslint-disable no-await-in-loop */
//* this service is used to get data from the pokeApi  *//
const CoreService = require('./core.service');
const logger = require('../../helpers/logger');

module.exports = class PokemonService extends CoreService {
  //* method to get the pokemon stats types id ...   *//
// endpoint : https://pokeapi.co/api/v2/pokemon/{id || name}/

  async getPokemonData(nameOrId) {
    const response = await this.get(`/pokemon/${nameOrId}`);
    return response;
  }

  //* method to get the number of existing generation  *//
  // endpoint : https://pokeapi.co/api/v2/generation/

  async getAllGenerationsCount() {
    const response = await this.get('/generation');
    return response.count;
  }

  //* method to get all pokemon of a generation by generation id  *//
  // endpoint : https://pokeapi.co/api/v2/generation/{id}/

  async getAllPokeByGeneration(id) {
    const response = await this.get(`/generation/${id}`);
    return response.pokemon_species;
  }

  //* method to get the french name and generation of a pokemon by pokemon id  *//
  // the gen is retrieved from the generation url in the response
  // endpoint : https://pokeapi.co/api/v2/pokemon-species/{id}/

  async getFrenchName(id) {
    const response = await this.get(`/pokemon-species/${id}`);
    const frenchName = response.names.find((name) => name.language.name === 'fr').name;
    const gen = response.generation.url.split('/')[6];

    return { frenchName, gen };
  }

  //* method to get the type data by type name  *//
  // endpoint : https://pokeapi.co/api/v2/type/{name}/

  async getTypeData(typeNameORId) {
    const response = await this.get(`/type/${typeNameORId}`);

    return response;
  }

  //* method to get all existing types   *//
  // endpoint : https://pokeapi.co/api/v2/type/

  async getAllTypes() {
    const response = await this.get('/type/');

    return response.results;
  }

  //* methode to get  damages, french name and english name of all types  *//
  // indeed, all this data is in the same endpoint

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
