const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CashTagSchema = new Schema({
    name: String,
    color: String
})

module.exports = mongoose.model('Cash Tag', CashTagSchema)