const express = require('express')
const router = express.Router()


const form_data = require('express-form-data')

const optionController = require('../controllers/option')

router.post('/upload-file', form_data.parse(), optionController.uploadExcel)

router.get('/stocks', optionController.getOptionsStocks)

router.post('/stock/delete', optionController.deleteOptionsStock)

router.post('/stock/chart', optionController.getOptionsChartData)

router.post('/stock/scrape', optionController.scrapeOptionStock)

router.get('/stock/:symbol/find', optionController.checkOptionStock)

router.get('/stock/:symbol', optionController.getOptionsStockData)

module.exports = router