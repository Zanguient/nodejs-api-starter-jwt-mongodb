const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('./asyncHandler');

const hashPassword = async function(next) {
  // hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};

const authResponse = () => (req, res, next) => {
  res.sendAuth = function(user) {
    const token = user.getJWT();

    this
      .json({
        success: true,
        authToken: token
      });
  };
  res.sendUnauth = function(msg = 'Auth error') {
    return next(new ErrorHandler(msg, 401));
  };
  next();
};

const protect = asyncHandler(async (req, res, next) => {
  let token = req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.sendUnauth('No auth token');
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload && payload.userId) {
    req.userId = payload.userId;
  }
  next();
});

module.exports = {hashPassword, authResponse,  protect};