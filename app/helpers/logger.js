require('dotenv').config();
const bunyan = require('bunyan');

const streams = [];

if (['production'].includes(process.env.NODE_ENV)) {
  streams.push({
    level: 'debug',
    path: './log/error.log',
    type: 'rotating-file',
    period: '1d',
    count: 5,
  });
} else if (!['test'].includes(process.env.NODE_ENV)) {
  streams.push({
    level: 'debug',
    stream: process.stdout,
  });
}

const logger = bunyan.createLogger({
  name: 'poke-api',
  streams,
});

logger.log = logger.info;
module.exports = logger;
