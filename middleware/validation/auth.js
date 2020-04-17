const validator = require('validator');
const ErrorHandler = require('../../utils/ErrorHandler');

const validateRegister = (req, res, next) => {
  const {email, name, password, password2} = req.body;

  if (!email || !name || !password || !password2) {
    return next(new ErrorHandler('Data is missing', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new ErrorHandler('Invalid email format', 400));
  }

  if (password !== password2) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  const passwordMinLength = 8;
  const passwordMaxLength = 18;
  if (password.length < passwordMinLength || password.length > passwordMaxLength) {
    return next(new ErrorHandler(`Password should have length between ${passwordMinLength} and ${passwordMaxLength}`, 400));
  }
  next();
}

const validateLogin = (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Data is missing', 400));
  }
  next();
}

module.exports = {validateRegister, validateLogin};