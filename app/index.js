const express = require('express');
const cors = require('cors');

const router = require('./routers/index');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

app.use(router);

module.exports = app;
