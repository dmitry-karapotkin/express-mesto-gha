const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62f4da80467d267590ee97cf',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый адрес не существует' });
});

app.listen(PORT);
