const express = require('express')
const router = express.Router()

const form_data = require('express-form-data')

const cashController = require('../controllers/cash')

router.post('/stocks/:page', cashController.getStocksTableData)

router.get('/stock/tags', cashController.getCashStockTags)

router.post('/stock/tags/update', cashController.updateCashStockTags)

router.post('/stock/note/update', cashController.updateCashStockNote)

router.get('/search', cashController.getStocksBySearch)

router.post('/upload-file', form_data.parse(), cashController.uploadExcel)

router.post('/stock/upload-file', form_data.parse(), cashController.uploadExcelForStock)

router.post('/stock/block/update', cashController.updateBlockCashStock)

router.post('/stock/delete', cashController.deleteStock)

router.post('/stock/field/add', cashController.addCustomHeader)

router.post('/stock/field/delete', cashController.deleteCustomHeader)

router.get('/headers', cashController.getCustomHeaders)

router.get('/stock/:symbol', cashController.getStock)

router.get('/:page', cashController.getStocksByPage)

module.exports = router