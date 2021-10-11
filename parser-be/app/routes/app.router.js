const express = require('express');
const controller = require('../controllers/app.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/exchange-rates', authMiddleware.checkToken, controller.index);
router.get('/exchange-rates/export/pdf', authMiddleware.checkToken, controller.exportPdf);
router.get('/exchange-rates/export/csv', authMiddleware.checkToken, controller.exportCsv);

module.exports = router;
