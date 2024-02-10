const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const router = require('./routers');

const app = express();

// require('./helpers/apiDocs')(app);

const bodyParser = multer();

app.use(bodyParser.none());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(router);

module.exports = app;
