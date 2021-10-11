const config = require('dotenv').config();
if (config.error) {
  throw config.error;
}

const port = process.env.APP_PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const routes = require('./routes');
const errorHandler = require('./handlers/error.handler');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(routes);
app.use(errorHandler);

app.listen(port, function () {
  console.log(`App running on the port ${port}`);
});

module.exports = app;
