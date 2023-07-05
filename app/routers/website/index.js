const express = require('express');
const controllerHandler = require('../../helpers/controllerHandler');
const { websiteController, adminController } = require('../../controllers/website');
const { ApiError } = require('../../helpers/errorHandler');
const loginShema = require('../../validation/schemas/userLogin.schema');
const validate = require('../../validation/validator');

const router = express.Router();

router.use((_, req, res, next) => {
  res.type('html');
  next();
});

router
  .route('/login')
  .post(controllerHandler(adminController.login));
router.get('/', controllerHandler(websiteController.home));

router.use(() => {
  throw new ApiError('page introuvable', { statusCode: 404 });
});

module.exports = router;
