const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CashData = require('./cash_data')

const CashStockSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    tags: [{
        type: String,
    }],
    block: {
        type: Boolean,
        default: false
    },
    note: {
        type: String
    }
})

CashStockSchema.post('findOneAndDelete', (doc, next) => {
    if(doc){
        CashData.deleteMany({stock: { $in: doc._id}}).exec()
    }
    next()
})

module.exports = mongoose.model('Cash Stock', CashStockSchema)