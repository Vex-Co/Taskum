const validator = require('validator')
const mongoose = require('../db/mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})
// Hiding Private data like token and password hash
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.tokens
  delete userObject.password

  return userObject 
}

// generateAuthToken() - Custom method
userSchema.methods.generateAuthToken = async function () {
  const user = this

  // Not secure but will make it.
  const token = jwt.sign({_id: user._id.toString()}, "someSecretKey")
  user.tokens = user.tokens.concat({token})

  return token
}
// findByCredentials() - Custom Static
userSchema.statics.findByCredantials = async (email, password) => {
  const user = await User.findOne({email});
  if (!user) {
    throw new Error("No Match found!");
  }
  const passMatch = bcrypt.compare(password, user.password);
  if (!passMatch) {
    throw new Error("No Match found!");
  }
  return user;
}
// Middleware
userSchema.pre('save', async function (next) {  //not arrow function because "this" binding is important
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})
userSchema.pre('remove', async function (next) {
  const user = this
  
  await Task.deleteMany({owner: user._id})
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User