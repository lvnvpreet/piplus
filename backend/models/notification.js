const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    date: {
        type: Date
    },
    alert:{
        type: Schema.Types.ObjectId,
        ref: 'Alert'
    },
    stock:{
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
}
)

module.exports = mongoose.model('Notification', NotificationSchema)