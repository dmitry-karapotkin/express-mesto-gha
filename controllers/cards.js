const Card = require('../models/cards');

const handleError = (err, res) => {
  if (err.name === 'CastError') {
    res.status(404).send({ message: 'Запрашивемая карточка не найдена' });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданные данные на карточку не прошли валидацию' });
  } else {
    res.status(500).send({ message: `На сервере произошла ошибка ${err.name} - ${err.message}` });
  }
};

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send(data))
    .catch((err) => handleError(err, res));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then(res.send({ message: `Карточка с ID ${cardId} удалена` }))
    .catch((err) => handleError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => data.populate('owner'))
    .then((data) => res.send(data))
    .catch((err) => handleError(err, res));
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((data) => res.send(data))
  .catch((err) => handleError(err, res));

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((data) => res.send(data))
  .catch((err) => handleError(err, res));

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
