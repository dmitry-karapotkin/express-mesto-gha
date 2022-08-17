const { celebrate, Joi } = require('celebrate');
const HTTP_REGEX = require('../utils/constants');

const validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(HTTP_REGEX)),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
});

module.exports = {
  validateNewUser,
  validateAuthentication,
  validateCardId,
};
