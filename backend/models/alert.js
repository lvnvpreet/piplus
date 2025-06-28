const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Notification = require('./notification')

const AlertSchema = new Schema({
    name: String,
    tags: [{
        type: String
    }], //['1': stock, '0': 'option', -1: 'mixed']
    color: String,
    description: String,
    limit: {
        type: Number,
        default: 0
    },
    conditions: [{
        num: Boolean,
        field1: String,
        operator: Number, //[1 : >,  -1: <]
        field2: String,
        num_field: Number,
        multiplier: {
            type: Number,
            default: 1
        },
        field1Day: {
            type: Number,
            default: 0
        },
        field2Day: {
            type: Number,
            default: 0
        }
    }]
})

AlertSchema.post('findOneAndDelete', (doc, next) => {
    if(doc){
        Notification.deleteMany({alert: doc._id}).exec()
    }
    next()
})

module.exports = mongoose.model('Alert', AlertSchema)