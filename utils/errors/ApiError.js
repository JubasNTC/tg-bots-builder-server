'use strict';

class ApiError extends Error {
  constructor(status, message) {
    super();

    this.status = status;
    this.message = message;
  }

  static Unauthorized() {
    return new ApiError(401, 'Необходимо выполнить авторизацию');
  }

  static BadRequest(message) {
    return new ApiError(400, message);
  }
}

module.exports = ApiError;
