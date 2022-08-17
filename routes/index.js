const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const { validateNewUser, validateAuthentication } = require('../middlewares/validations');

router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateAuthentication, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход выполнен успешно' });
});
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый адрес не существует'));
});

module.exports = router;
