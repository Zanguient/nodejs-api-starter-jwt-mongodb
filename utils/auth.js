const jwt = require('jsonwebtoken');

const getJWT = function() {
  return token = jwt.sign({userId: this.id, timestamp: Date.now()}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
};

module.exports = {getJWT};