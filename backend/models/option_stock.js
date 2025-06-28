const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OptionStockSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
})

module.exports = mongoose.model('Option Stock', OptionStockSchema)