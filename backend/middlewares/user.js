const jwt = require('jsonwebtoken')

const User = require('../models/user')
const CustomError = require('../error')

module.exports = async(req, res, next) => {
    try {
        const token = req.headers.authorization
        const decodedtoken = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedtoken.data)
        if(user) {
            req.id = user._id
            next()
        } else {
            throw new  CustomError("Not Authorized", 403)
        }
    } catch(err) {
        // console.log(err)
        error = new CustomError("Authorization Token expired", 401)
        next(error)
    }
}