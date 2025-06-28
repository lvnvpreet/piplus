const express = require('express')
const router = express.Router()
 
const alertController = require('../controllers/alert')

router.get('/all', alertController.getAllAlerts)

router.post('/add', alertController.addAlert)

router.post('/alert/scan', alertController.scanByAlert)

router.post('/alert/scanned', alertController.getAlertScannedDays)

router.post('/alert/delete', alertController.deleteAlert)

router.post('/alert/clone', alertController.cloneAlert)

router.post('/alert/conditions/save', alertController.saveAlert)

router.get('/alert/:id', alertController.getAlert)

module.exports = router
