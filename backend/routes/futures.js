const express = require('express')
const router = express.Router()

const form_data = require('express-form-data')

const controller = require('../controllers/futures')

router.get('/stocks/all', controller.getAllStocks)

router.post('/upload-file', form_data.parse(), controller.uploadExcel)

router.post('/stock/delete', controller.deleteStock)

router.get('/stock/months', controller.getMonths)

router.get('/stock/check/:symbol', controller.checkIfOtherStockExists)

router.post('/stock/:symbol', controller.getStockData)

module.exports = router