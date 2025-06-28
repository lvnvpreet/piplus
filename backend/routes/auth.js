const express = require('express')
const router = express.Router()


const auth_controller = require('../controllers/auth')

router.post('/login', auth_controller.userLogin)
router.post('/register', auth_controller.userRegister)

module.exports = router