class BadAuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadAuthorizationError';
    this.statusCode = 401;
    this.message = 'Неправильные почта или пароль';
  }
}

module.exports = BadAuthorizationError;
