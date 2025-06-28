const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const CustomError = require('../error')

exports.userLogin = async(req, res, next) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({email: email})
        if(!user) {
            throw new CustomError('User not found! Check your credentials.', 404)
        }
        const match = await bcrypt.compare(password, user.password)
        let token
        if(match){
            token = await jwt.sign({ data: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        } else {
            throw new CustomError("Incorrect Password! Check your credentials.", 401)
        }
        res.json(
            token
        )
    } catch(err) {
        next(err)
    }
}

exports.userRegister = async(req, res, next) => {
    try {
        const { name, email, password } = req.body
        
        // Check if user already exists
        const existingUser = await User.findOne({email: email})
        if(existingUser) {
            throw new CustomError('User already exists with this email!', 400)
        }
        
        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        // Create new user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        })
        
        await newUser.save()
        
        // Generate token
        const token = await jwt.sign({ data: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        
        res.json({
            message: 'User registered successfully!',
            token: token
        })
    } catch(err) {
        next(err)
    }
}