const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const HTTP_REGEX = require('../utils/constants');

const joiParamsCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
});

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(new RegExp(HTTP_REGEX)),
  }),
}), createCard);
router.delete('/:cardId', joiParamsCardId, deleteCard);
router.put('/:cardId/likes', joiParamsCardId, likeCard);
router.delete('/:cardId/likes', joiParamsCardId, dislikeCard);

module.exports = router;
