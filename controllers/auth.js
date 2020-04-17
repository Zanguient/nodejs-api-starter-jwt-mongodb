const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const sayHi = (req, res) => {
  res.status(200).send('Hi!');
};

const protectedTest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  res.status(200).json({name: user.name});
});

const register = asyncHandler(async (req, res, next) => {
  const {email, name, password} = req.body;

  const user = new User({email, name, password});
  await user.save();

  res.status(201).sendAuth(user);
});

const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email}).select('+password');

  if (!user || !user.password) {
    return res.sendUnauth();
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return res.sendUnauth();
  }

  res.status(200).sendAuth(user);
});

module.exports = {
  sayHi, protectedTest, register, login
};