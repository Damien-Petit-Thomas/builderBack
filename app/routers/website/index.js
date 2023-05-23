const express = require('express');
const controllerHandler = require('../../helpers/controllerHandler');
const { websiteController } = require('../../controllers/website');
const { ApiError } = require('../../helpers/errorHandler');

const router = express.Router();

router.use((_, req, res, next) => {
  res.type('html');
  next();
});

router.get('/', controllerHandler(websiteController.home));

router.use(() => {
  throw new ApiError('page introuvable', { statusCode: 404 });
});

module.exports = router;
