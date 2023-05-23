const express = require('express');

const apiRouter = require('./api');
const websiteRouter = require('./website');
const { errorHandler } = require('../helpers/errorHandler');

const router = express.Router();

router.use('/api', apiRouter);
router.use('/', websiteRouter);

router.use(errorHandler);

module.exports = router;
