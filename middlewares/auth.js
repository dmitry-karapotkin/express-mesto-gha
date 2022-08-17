const jwt = require('jsonwebtoken');
const BadAuthorizationError = require('../errors/bad-auth-error');

const auth = (req, res, next) => {
  const { jwt: token } = req.cookies;
  let payload;
  try {
    payload = jwt.verify(token, 'awesome-difficulty');
  } catch (err) {
    next(new BadAuthorizationError());
  }
  req.user = payload;
  next();
};

module.exports = auth;
