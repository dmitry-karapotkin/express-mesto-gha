const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { auth, joiJwtCookie } = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const HTTP_REGEX = require('./utils/constants');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(HTTP_REGEX)),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', joiJwtCookie, userRouter);
app.use('/cards', joiJwtCookie, cardRouter);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый адрес не существует'));
});

app.use((err, req, res, next) => {
  let statusCode;
  let errMessage;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
    errMessage = 'Переданные данные не прошли валидацию';
  } else if (err.code === 11000) {
    statusCode = 409;
    errMessage = 'Пользователь с данным email уже зарегистрирован';
  } else {
    statusCode = (!err.statusCode) ? 500 : err.statusCode;
    errMessage = (statusCode === 500) ? `На сервере произошла ошибка ${err.name} - ${err.message}` : err.message;
  }
  res.status(statusCode).send({ message: errMessage });
  next();
});

app.listen(PORT);
