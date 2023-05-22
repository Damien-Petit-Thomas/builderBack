const express = require('express');

const { typeController: controller } = require('../controllers/index');
const controllerHandler = require('../helpers/controllerHandler');

const router = express.Router();

router
  .route('/')
  .get(controllerHandler(controller.getAllTypes));
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
  .route('/resist/types')
  .post(controllerHandler(controller.getResistanceToTypeList));
module.exports = router;
