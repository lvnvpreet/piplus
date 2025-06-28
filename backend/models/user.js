const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String, // $HelloWorld2002
})

module.exports = mongoose.model('User', UserSchema)