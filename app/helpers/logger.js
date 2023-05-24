require('dotenv').config();
const bunyan = require('bunyan');

const streams = [];

if (['production'].includes(process.env.NODE_ENV)) {
  streams.push({
    level: 'error',
    path: './log/error.log',
    type: 'rotating-file',
    period: '10000ms', // daily rotation
    count: 5, // keep 3 back copies
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
