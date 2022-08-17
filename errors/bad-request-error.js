class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = 'Переданные данные не прошли валидацию';
  }
}

module.exports = BadRequestError;
