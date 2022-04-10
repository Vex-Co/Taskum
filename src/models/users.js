const validator = require('validator')
const mongoose = require('../db/mongoose')

const User = mongoose.model('User', {
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
});
module.exports = User;