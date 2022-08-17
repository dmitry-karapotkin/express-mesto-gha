class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = 'Пользователь с данным email уже зарегистрирован';
  }
}

module.exports = BadRequestError;
