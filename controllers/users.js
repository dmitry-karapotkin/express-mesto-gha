const User = require('../models/users');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const handleError = (err, res) => {
  if (err.name === 'NotFoundError') {
    res.status(404).send({ message: err.message });
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Переданные данные на пользователя не прошли валидацию' });
  } else {
    res.status(500).send({ message: `На сервере произошла ошибка ${err.name} - ${err.message}` });
  }
};

const getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => handleError(err, res));
};

const getOneUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(data);
    })
    .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => res.send(data))
    .catch((err) => handleError(err, res));
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((data) => res.send(data))
    .catch((err) => handleError(err, res));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((data) => res.send(data))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};