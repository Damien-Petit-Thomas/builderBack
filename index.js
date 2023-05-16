const http = require('http');

const cors = require('cors');
const app = require('./app');
const logger = require('./app/helpers/logger');

app.use(cors());

const port = process.env.PORT ?? 3000;

const server = http.createServer(app);

server.listen(port, () => {
  logger.log(`Houston listening on port :  http://localhost:${port}`);
});
