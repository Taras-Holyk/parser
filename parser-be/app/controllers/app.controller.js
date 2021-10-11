const request = require('request-promise');
const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const os = require('os');

const dateHelper = require('../helpers/date.helper');
const parserLogRepository = require('../repositories/parser-log.repository');

async function index(req, res) {
  const requestedDate = dateHelper.formatDate(new Date(req.query.date));
  const recentlyRequestedData = await parserLogRepository.getRecentByUserAndDate(req.user.id, requestedDate);
  if (recentlyRequestedData) {
    return res.status(200)
      .json({
        success: true,
        data: recentlyRequestedData.exchange_rates
      });
  }

  let url = process.env.MIN_FIN_PARSER_URL;
  if (req.query.date) {
    url += '?date=' + requestedDate;
  }

  try {
    const minFinExchangeRates = await request({
      uri: url,
      json: true
    });

    await parserLogRepository.store({
      user_id: req.user.id,
      date: requestedDate,
      origin: 'minfin',
      exchange_rates: minFinExchangeRates,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(200)
      .json({
        success: true,
        data: minFinExchangeRates
      });
  } catch (e) {
    return res.status(500)
      .json({
        success: false,
        message: 'Internal server error'
      });
  }
}

async function exportPdf(req, res) {
  const lastRequestedData = await parserLogRepository.getLastByUser(req.user.id);
  if (!lastRequestedData) {
    return res.status(500)
      .json({
        success: false,
        message: 'Internal server error'
      });
  }

  const html = fs.readFileSync('./views/pdf.report.ejs', 'utf8');
  const rendered = ejs.render(html, { exchangeRates: lastRequestedData.exchange_rates });
  const filename = `${req.user.id}_${new Date().getTime()}.pdf`;

  pdf.create(rendered, { format: 'Letter' })
    .toFile(`./public/pdf/${filename}`, (err, response) => {
      if (err) {
        return res.status(500)
          .json({
            success: false,
            message: 'Internal server error'
          });
      }

      response.filename = `${process.env.APP_URL}/pdf/${filename}`;

      return res.status(200)
        .json({
          success: true,
          data: response
        });
    });
}

async function exportCsv(req, res) {
  const lastRequestedData = await parserLogRepository.getLastByUser(req.user.id);

  if (!lastRequestedData) {
    return res.status(500)
      .json({
        success: false,
        message: 'Internal server error'
      });
  }

  const filename = `${req.user.id}_${new Date().getTime()}.csv`;
  const output = [];

  for (let currency of lastRequestedData.exchange_rates) {
    const row = [];
    row.push(currency.title);
    row.push(`${currency.cash.purchase}/${currency.cash.selling}`);
    row.push(currency.nbu);
    row.push(`${currency.black.purchase}/${currency.black.selling}`);

    output.push(row.join());
  }

  fs.writeFileSync(`./public/csv/${filename}`, output.join(os.EOL));

  return res.status(200)
    .json({
      success: true,
      data: {
        filename: `${process.env.APP_URL}/csv/${filename}`
      }
    });
}

module.exports = {
  index,
  exportPdf,
  exportCsv
};
