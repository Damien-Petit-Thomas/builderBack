const express = require('express');
const {
  pokemonController: controller,
  pokeDamageController: controllerDamage,
  completionController: controllerCompletion,

} = require('../../controllers/api');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router
  .route('/')
  .get(controllerHandler(controller.getAll));
router
  .route('/:id(\\d+)')
  .get(controllerHandler(controller.getOne));
router
  .route('/type/:id(\\d+)')
  .get(controllerHandler(controller.getPokemonByTypeId));
router
  .route('/:data([a-zA-Z]+)')
  .get(controllerHandler(controller.getByName));
router
  .route('/type/:id1(\\d+)/:id2(\\d+)')
  .get(controllerHandler(controller.getPokemonByTypesIds));
router
  .route('/gen/:id(\\d+)')
  .get(controllerHandler(controller.getPokemonByGenId));
router
  .route('/ability/:id(\\d+)')
  .get(controllerHandler(controller.getPokemonByAbilityId));
router
  .route('/:id(\\d+)/abilities')
  .get(controllerHandler(controller.getAbilitiesByPokemonId));
router
  .route('/immune/type/:id(\\d+)')
  .get(controllerHandler(controllerDamage.getNoDamageFrom));
router
  .route('/resist/type/:id(\\d+)')
  .get(controllerHandler(controllerDamage.getHalfDamageFrom));
// router
//   .route('/weak/type/:id(\\d+)')
//   .get(controllerHandler(controller.getDoubleDamageFrom));
router
  .route('/resist-immune/type/:id(\\d+)')
  .get(controllerHandler(controllerDamage.getNoDamageFromOrHalfDamageFrom));
// router
//   .route('/resist/imune/type/:id(\\d+)/type/:id2(\\d+)')
//   .get(controllerHandler(controller.getNoDamageFromAndHalfDamageFromToTypes));
router
  .route('/full-random')
  .get(controllerHandler(controller.getFullRandomTeam));
router
  .route('/complet-team')
  .post(controllerHandler(controllerCompletion.getTeamCompletion));
router.use(() => {
  throw new Error('Route not found');
});
// router
//   .route('/:type1/:type2')
//   .get(controllerHandler(controller.getDamageBetweenTwoTypes));
module.exports = router;
