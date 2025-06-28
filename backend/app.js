const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const cron = require('node-cron')

const port = process.env.PORT || 5000

const isUser = require('./middlewares/user')
const authRoutes = require('./routes/auth')
const notificationRoutes = require('./routes/notification')
const cashRoutes = require('./routes/cash')
const optionRoutes = require('./routes/option')
const alertRoutes = require('./routes/alert')
const futuresRoutes = require('./routes/futures')

const cronController = require('./controllers/cron')

const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(
	bodyParser.urlencoded({
		limit: '100mb',
		extended: true,
		parameterLimit: 50000,
	})
)

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/piplus`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})
mongoose.set('useCreateIndex', true)

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
	console.log('✅ MongoDB connected successfully!')
})

mongoose.connection.on('error', (err) => {
	console.log('❌ MongoDB connection error:', err.message)
	console.log('💡 Make sure MongoDB is running on localhost:27017')
})

mongoose.connection.on('disconnected', () => {
	console.log('⚠️ MongoDB disconnected')
})

// cron.schedule('30,59 9-15 * * 1-5', cronController.scrapeOptionsData, {
// 	timezone: 'Asia/Kolkata'
// })

// cron.schedule('30 9 * * 1-5', cronController.scrapeDataForPreviousData, {
// 	timezone: 'Asia/Kolkata'
// })

app.use('/api/auth', authRoutes)
app.use('/api/cash', isUser, cashRoutes)
app.use('/api/options', isUser, optionRoutes)
app.use('/api/futures', isUser, futuresRoutes)
app.use('/api/alerts', isUser, alertRoutes)
app.use('/api/notifications', isUser, notificationRoutes)

// Test endpoint
app.get('/api/test', (req, res) => {
	res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() })
})

app.use((req, res, next) => {
	var error = new Error('Route not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
	console.log(error)
	res.json({
		error: error.message,
	})
})


app.listen(port, 'localhost', () => {
	console.log(`🚀 Backend server running on http://localhost:${port}`)
	console.log(`📊 PiPlus Trading Platform API`)
	console.log(`🔌 Attempting to connect to MongoDB...`)
})

