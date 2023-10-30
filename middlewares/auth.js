const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/UnathorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnathorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'mesto');
  } catch (err) {
    throw new UnathorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
