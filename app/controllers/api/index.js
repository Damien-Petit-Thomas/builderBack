const pokemonController = require('./pokemon');
const pokemonSeedingController = require('./seeding.controller');
const typeController = require('./type');
const teamController = require('./team');
const cacheController = require('./cache');
const userController = require('./user');
const generationController = require('./generation');

const apiController = {

  home(req, res) {
    // const fullUrl = `${req.protocol}://${req.get('host')}`;
    res.send(
      // documentation_url: `${fullUrl}${process.env.API_DOCS}` ?? '/api-docs',
      'catch them all',
    );
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
