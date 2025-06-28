const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CashDataSchema = new Schema({
    date: Date,
    prev_close: Number,
    open_price: Number,
    high_price: Number,
    low_price: Number,
    last_price: Number,
    close_price: Number,
    avg_price: Number,
    ttl_trd_qnty: Number,
    turnover_lacs: Number,
    no_of_trades: Number,
    deliv_qty: Number,
    deliv_per: Number,
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Cash Stock'
    },
})

module.exports = mongoose.model('Cash Data', CashDataSchema)