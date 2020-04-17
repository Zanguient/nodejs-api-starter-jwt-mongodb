const xss = require('xss');

const sanitize = (data = '') => {
  let isObject = false
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = xss(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
}

const xssSanitize = () => (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

module.exports = xssSanitize;
