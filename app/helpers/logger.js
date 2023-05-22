require('dotenv').config();
const bunyan = require('bunyan');

const streams = [];

if (process.env.NODE_ENV === 'development') {
  streams.push({
    level: 'debug',
    stream: process.stdout, // log INFO and above to stdout
  });
} else if (process.env.NODE_ENV === 'production') {
  streams.push({
    level: 'debug',
    type: 'rotating-file',
    path: './log/error.log', // log ERROR and above to a file
    period: '2h', // daily rotation
    count: 72, // keep 3 back copies
  });
}

const logger = bunyan.createLogger({
  name: 'poke',
  streams,
  level: 'debug', // Ajout du niveau de log "debug"
});

logger.log = logger.info;
module.exports = logger;
