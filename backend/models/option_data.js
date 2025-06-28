const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OptionDataSchema = new Schema({
    date: Date,
    expiry_date: Date,
    underlying_value: Number,
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Option'
    },
    data: [{
        strike_price: Number,
        CE: {
            open_interest: Number,
            change_in_OI: Number,
            volume: Number,
            IV: Number,
            last_price: Number,
            change: Number
        },
        PE: {
            open_interest: Number,
            settlement: Number,
            change_in_OI: Number,
            volume: Number,
            IV: Number,
            last_price: Number,
            change: Number,
            PREMIUM_TR: Number,
            TRADED_QUA: Number
        }
    }],
    createdAt: Date
})

module.exports = mongoose.model('Option Data', OptionDataSchema)