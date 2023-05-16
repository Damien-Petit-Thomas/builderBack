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
    level: 'info',
    type: 'rotating-file',
    path: `${process.env.LOG_PATH || 'logs/'}error.log`, // log ERROR and above to a file
    period: '1d', // daily rotation
    count: 3, // keep 3 back copies
  });
}

const logger = bunyan.createLogger({
  name: 'poke',
  streams,
  level: 'debug', // Ajout du niveau de log "debug"
});

logger.log = logger.info;
module.exports = logger;
