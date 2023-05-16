const express = require('express');

const { typeController: controller } = require('../controllers/index');
const controllerHandler = require('../helpers/controllerHandler');

const router = express.Router();

router
  .route('/')
  .get(controllerHandler(controller.getAllTypes));

module.exports = router;
