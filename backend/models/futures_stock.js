const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FuturesData = require('./futures_data')

const FutureStockSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
})

FutureStockSchema.post('findOneAndDelete', (doc, next) => {
    if(doc){
        FuturesData.deleteMany({stock: { $in: doc._id}}).exec()
    }
    next()
})

module.exports = mongoose.model('Future Stock', FutureStockSchema)