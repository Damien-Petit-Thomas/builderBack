const express = require('express');

const { teamController: controller } = require('../controllers/index');
const controllerHandler = require('../helpers/controllerHandler');

const router = express.Router();

// router
//   .route('/full-random')
//   .get(controllerHandler(controller.getFullRandomTeam));
// router
//   .route('/suggested')
//   .post(controllerHandler(controller.getTeamCompletion));
module.exports = router;
