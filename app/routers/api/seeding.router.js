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
router
  .route('/abilities')
  .get(controllerHandler(controller.seedAbilities));
router
  .route('/ability/:id(\\d+)')
  .get(controllerHandler(controller.seedOneAbilities));
router
  .route('/pokemon_has_ability')
  .get(controllerHandler(controller.seedPokemonHasAbility));
router.use(() => {
  throw new Error('Route not found');
});
module.exports = router;
