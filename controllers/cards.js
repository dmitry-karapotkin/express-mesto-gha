const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send(data))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (data.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError();
      }
      return Card.findByIdAndRemove(cardId)
        .then((card) => res.send({ message: `Карточка ${card.name} удалена` }));
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => data.populate('owner'))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  {
    new: true,
    runValidators: true,
    upsert: false,
  },
)
  .populate(['owner', 'likes'])
  .then((data) => {
    if (data === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    res.send(data);
  })
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  {
    new: true,
    runValidators: true,
    upsert: false,
  },
)
  .populate(['owner', 'likes'])
  .then((data) => {
    if (data === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    res.send(data);
  })
  .catch(next);

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
