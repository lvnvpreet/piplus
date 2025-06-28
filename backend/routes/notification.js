const express = require('express')
const router = express.Router()


const notificationController = require('../controllers/notification')

router.post('/all', notificationController.getNotifications)

router.post('/filter', notificationController.filterNotifications)


module.exports = router
