const validator = require('validator')
const mongoose = require('../db/mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error ("Not a valid email.")
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value === "password") throw new Error("Pasword is very weak") 
    }
  }
})

// Middleware
userSchema.pre('save', async function (next) {  //not arrow function because "this" binding is important
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User