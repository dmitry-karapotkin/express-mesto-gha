const jwt = require('jsonwebtoken');
const { celebrate, Joi } = require('celebrate');
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

const joiJwtCookie = celebrate({
  cookies: Joi.object({
    jwt: Joi.string().required(),
  }),
});

module.exports = {
  auth,
  joiJwtCookie,
};
