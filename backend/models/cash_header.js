const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CashHeaderSchema = new Schema({
    name: {
        type: String
    },
    custom: {
        type: Boolean,
        default: undefined
    },
    formula: {
        type: String,
        default: undefined
    },
    ma: {
        type: Schema.Types.Mixed,
        default: undefined,
        days: {
            type: Number,
        },
        field: {
            type: String,
        },
        
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Cash Header', CashHeaderSchema)
