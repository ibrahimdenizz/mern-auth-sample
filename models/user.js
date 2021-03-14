const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    minLenght: 5,
    maxLength: 100,
    required: true,
  },
  password: {
    type: String,
    minLenght: 5,
    maxLength: 255,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    required: true,
  },
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))

  return token
}

const User = mongoose.model('Users', userSchema)

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(100).required(),
    password: Joi.string().min(5).max(50).required(),
  })

  return schema.validate(user)
}

exports.User = User
exports.validate = validateUser
