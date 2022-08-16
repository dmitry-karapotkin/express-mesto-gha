const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const getOneUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(data);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.send({
      name,
      about,
      avatar,
      email,
    }))
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
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
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
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
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOneByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'awesome-difficulty',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 604800,
        })
        .send({ message: 'Вход выполнен успешно' })
        .end();
    })
    .catch(next);
};

const getMyUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((data) => res.send(data))
    .catch(next);
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getMyUser,
};
