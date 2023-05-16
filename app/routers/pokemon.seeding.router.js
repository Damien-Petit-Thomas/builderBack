const express = require('express');
const { pokemonSeedingController: controller } = require('../controllers');
const controllerHandler = require('../helpers/controllerHandler');

const router = express.Router();

router
  .route('/:id(\\d+)')
  .get(controllerHandler(controller.seedOnePokemon));

router
  .route('/all')
  .get(controllerHandler(controller.seedAllPokemon));

router
  .route('/types')
  .get(controllerHandler(controller.seedTypes));
router
  .route('/generations')
  // only here because of change in the db schema now all pokemon have a gen_id column
  .get(controllerHandler(controller.seedGen_idColumn));

module.exports = router;
