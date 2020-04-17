const mongoose = require('mongoose');

const {hashPassword} = require('../middleware/auth');
const {getJWT} = require('../utils/auth');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', hashPassword);

userSchema.methods.getJWT = getJWT;

module.exports = mongoose.model('User', userSchema);
