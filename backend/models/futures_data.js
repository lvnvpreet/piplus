const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FutureDataSchema = new Schema({
  month: Date,
  stock: {
    type: Schema.Types.ObjectId,
    ref: 'Future Stock'
  },
  data: [{
    date: Date,
    close_price: Number,
    settlement: Number,
    net_change: Number,
    oi_no_con: Number,
    quantity: Number,
    trd_no_con: Number,
    value: Number,
    underlying_value: Number
  }]
})

module.exports = mongoose.model('Future Data', FutureDataSchema)