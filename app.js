const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(errors());
app.use(router);

app.use((err, req, res, next) => {
  const statusCode = (!err.statusCode) ? 500 : err.statusCode;
  const errMessage = (statusCode === 500) ? `На сервере произошла ошибка ${err.name} - ${err.message}` : err.message;
  res.status(statusCode).send({ message: errMessage });
  next();
});

app.listen(PORT);
