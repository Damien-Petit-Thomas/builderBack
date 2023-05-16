const pokemonController = require('./pokemon');
const pokemonSeedingController = require('./seeding.controller');
const typeController = require('./type');
const teamController = require('./team');
const cacheController = require('./cache');
const userController = require('./user');
const generationController = require('./generation');

const apiController = {

  home(req, res) {
    res.send('Welcome to the PokeAPI');
  },
};

module.exports = {
  generationController,
  apiController,
  pokemonController,
  pokemonSeedingController,
  typeController,
  teamController,
  cacheController,
  userController,
};
