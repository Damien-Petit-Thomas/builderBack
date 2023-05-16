const express = require('express');
const { generationController: controller } = require('../controllers');
const controllerHandler = require('../helpers/controllerHandler');

const router = express.Router();

router
  .route('/')
  .get(controllerHandler(controller.getAllGenerations));
// router
// .route('/:id(\\d+)')
// .get(controllerHandler(controller.getOne));

module.exports = router;
