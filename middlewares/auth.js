const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/UnathorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnathorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'mesto');
  } catch (err) {
    next(new UnathorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
