const express = require('express');

const { teamController: controller } = require('../../controllers/api');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

// router
//   .router('/create')
//   .post(controllerHandler(controller.createTeam));

// router
//   .route('/suggested')
//   .post(controllerHandler(controller.getTeamCompletion));
module.exports = router;
