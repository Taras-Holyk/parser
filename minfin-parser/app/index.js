const config = require('dotenv').config();
if (config.error) {
  throw config.error;
}

const http = require('http');
const port = process.env.APP_PORT || 3001;

const minFinSiteParser = require('./helpers/minfin-site.parser');

const server = http.createServer();

server.on('request', async (req, res) => {
  const exchangeRates = await minFinSiteParser
    .getExchangeRates((new URL(req.url, `http://${req.headers.host}/`)).searchParams);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(exchangeRates));
  res.end();
});

server.on('error', (err) => {
  console.log(err.stack);
});

server.listen(port, () => {
  console.log(`App running on the port ${port}`);
});
