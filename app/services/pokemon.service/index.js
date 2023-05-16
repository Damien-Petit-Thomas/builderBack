const axios = require('axios');
const logger = require('../../helpers/logger');

const PokemonService = require('./pokeApi.service');

module.exports = {
  pokeApi: new PokemonService(axios, logger),
};
