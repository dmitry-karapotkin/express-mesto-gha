const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getOneUser,
  updateUserInfo,
  updateUserAvatar,
  getMyUser,
} = require('../controllers/users');
const HTTP_REGEX = require('../utils/constants');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required().length(24),
  }),
}), getOneUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(HTTP_REGEX)),
  }),
}), updateUserAvatar);

module.exports = router;
