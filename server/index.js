const http = require('http');
require('dotenv').config(); // to use .env variables
require("./db/connectDB");

const app = require('./app');

const config = require('./configs/default');

const port = config.port;



const server = http.createServer(app);
server.listen(port);

console.log('Server is running on = localhost:' + port);