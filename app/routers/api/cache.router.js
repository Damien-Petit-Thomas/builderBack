const express = require('express');
const { cacheController: controller } = require('../../controllers/api');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router
  .route('/all')
  .get(controllerHandler(controller.getAll));
router.use(() => {
  throw new Error('Route not found');
});
module.exports = router;
