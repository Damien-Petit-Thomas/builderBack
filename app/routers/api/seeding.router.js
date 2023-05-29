const express = require('express');
const { seedingController: controller } = require('../../controllers/api');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router
  .route('/all')
  .get(controllerHandler(controller.seedAllPokemon));
router
  .route('/:id(\\d+)')
  .get(controllerHandler(controller.seedOnePokemon));

router
  .route('/types')
  .get(controllerHandler(controller.seedTypes));
router
  .route('/generation_id')
  // only here because of change in the db schema now all pokemon have a gen_id column
  .get(controllerHandler(controller.seedGen_idColumn));
router
  .route('/generations')
  .get(controllerHandler(controller.seedGenerations));
module.exports = router;
