const express = require('express');

const { abilityController: controller } = require('../../controllers/api');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router
  .route('/')
  .get(controllerHandler(controller.getAllAbilities));
router.use(() => {
  throw new Error('Route not found');
});
module.exports = router;
