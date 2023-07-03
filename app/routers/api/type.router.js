const express = require('express');

const { typeController: controller } = require('../../controllers/api');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router
  .route('/')
  .get(controllerHandler(controller.getAllTypes));
router
  .route('/:id(\\d+)')
  .get(controllerHandler(controller.getTypeById));
router
  .route('/immune/:id(\\d+)')
  .get(controllerHandler(controller.getNoDamageFrom));
router
  .route('/resist/:id(\\d+)')
  .get(controllerHandler(controller.getHalfDamageFrom));
router
  .route('/weak/:id(\\d+)')
  .get(controllerHandler(controller.getDoubleDamageFrom));
router
  .route('/resist-imune/:id(\\d+)')
  .get(controllerHandler(controller.getNoDamageFromAndHalfDamageFrom));
router
  .route('/resist/types')
  .post(controllerHandler(controller.getResistanceToTypeList));
router.use(() => {
  throw new Error('Route not found');
});
module.exports = router;
