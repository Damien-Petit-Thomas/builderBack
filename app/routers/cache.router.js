const express = require('express');
const { cacheController: controller } = require('../controllers');
const controllerHandler = require('../helpers/controllerHandler');

const router = express.Router();

router
  .route('/all')
  .get(controllerHandler(controller.getAll));

module.exports = router;
