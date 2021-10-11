const request = require('request-promise');
const cheerio = require('cheerio');

const currencies = [
  { code: 'usd', index: 0 },
  { code: 'eur', index: 1 },
  { code: 'rub', index: 2 },
  { code: 'pln', index: 3 },
  { code: 'gbp', index: 4 },
  { code: 'chf', index: 5 }
];

async function getExchangeRates(params) {
  const parseUrl = generateUrlForParsing(params);
  const $ = await getUrlContent(parseUrl);
  const exchangeRatesTable = $('.mfcur-table-lg-currency');
  let exchangeRates = [];

  for (const currency of currencies) {
    exchangeRates.push(getCurrencyExchangeRates(exchangeRatesTable, currency));
  }

  return exchangeRates;
}

function generateUrlForParsing(params) {
  let url = 'https://minfin.com.ua/ua/currency/';

  if (params.date) {
    url += params.date;
  }

  return url;
}

function getUrlContent(url) {
  try {
    const options = {
      uri: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
        'Content-Type': 'text/html; charset=utf-8'
      },
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    return request(options);
  } catch (e) {
    console.error(e);
  }
}

function getCurrencyExchangeRates(exchangeRatesTable, currency) {
  let exchangeRates = {};

  const tableCell = exchangeRatesTable.find('tbody')
    .find('tr').eq(currency.index).find('td');

  exchangeRates.title = tableCell.find('a').text().trim();

  exchangeRates.cash = (function ([purchase, selling]) {
    return { purchase, selling };
  })(getTableCellContent(tableCell, 1));

  exchangeRates.nbu = tableCell.eq(2)
    .find('span.mfcur-nbu-full-wrap')
    .contents().filter((index, element) => {
      return element.nodeType === 3;
    }).text().trim();

  exchangeRates.black = (function ([purchase, selling]) {
    return { purchase, selling };
  })(getTableCellContent(tableCell, 3));

  return exchangeRates;
}

function getTableCellContent(tableCell, index) {
  return tableCell.eq(index)
    .contents().filter((index, element) => {
      return element.nodeType === 3;
    }).text().trim().replace(/,/g, '.').split(/\n+/);
}

module.exports = { getExchangeRates };
