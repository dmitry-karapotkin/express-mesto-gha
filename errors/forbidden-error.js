class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.message = 'У вас недостаточно прав для выполнения этого действия';
  }
}

module.exports = ForbiddenError;
