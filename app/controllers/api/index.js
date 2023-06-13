const pokemonController = require('./pokemon/pokemon');
const pokeDamageController = require('./pokemon/damage');
const completionController = require('./pokemon/complet');
const seedingController = require('./seeding');
const typeController = require('./type');
const teamController = require('./team');
const cacheController = require('./cache');
const userController = require('./user');
const generationController = require('./generation');
const abilityController = require('./ability');

const apiController = {

  home(req, res) {
    const fullUrl = `${req.protocol}://${req.get('host')}`;
    res.send({
      documentation_url: `${fullUrl}${process.env.API_DOCS}`,

    });
  },
};

module.exports = {
  abilityController,
  completionController,
  generationController,
  apiController,
  pokemonController,
  pokeDamageController,
  seedingController,
  typeController,
  teamController,
  cacheController,
  userController,
};
