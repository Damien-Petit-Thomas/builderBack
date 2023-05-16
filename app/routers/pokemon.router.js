const express = require('express');
const { pokemonController: controller } = require('../controllers');

const controllerHandler = require('../helpers/controllerHandler');

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
  .route('/gen/:id(\\d+)')
  .get(controllerHandler(controller.getPokemonByGenId));
router
  .route('/imune/type/:id(\\d+)')
  .get(controllerHandler(controller.getNoDamageFrom));
router
  .route('/resist/type/:id(\\d+)')
  .get(controllerHandler(controller.getHalfDamageFrom));
router
  .route('/weak/type/:id(\\d+)')
  .get(controllerHandler(controller.getDoubleDamageFrom));
router
  .route('/resist/imune/type/:id(\\d+)')
  .get(controllerHandler(controller.getNoDamageFromAndHalfDamageFrom));
router
  .route('/:name([a-zA-Z]+)')
  .get(controllerHandler(controller.getOneByName));

router
  .route('/resist/imune/type/:id(\\d+)/type/:id2(\\d+)')
  .get(controllerHandler(controller.getNoDamageFromAndHalfDamageFromToTypes));
router
  .route('/full-random')
  .get(controllerHandler(controller.getFullRandomTeam));
router
  .route('/suggested')
  .post(controllerHandler(controller.getTeamCompletion));
// router
//   .route('/:type1/:type2')
//   .get(controllerHandler(controller.getDamageBetweenTwoTypes));
module.exports = router;
