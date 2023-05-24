const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'O\'Builder',
    description: 'O\'Builder API l\'API pour les dresseurs de pokémon',
  },

  baseDir: __dirname,
  filesPattern: ['./*.js'],
  swaggerUIPath: process.env.API_PATH,
  exposeApiDocs: true,
  apiDocsPath: '/api-docs',

};

module.exports = (app) => expressJSDocSwagger(app)(options);
