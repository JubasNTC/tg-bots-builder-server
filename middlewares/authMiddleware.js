'use strict';

const TokensService = require('services/TokensService');
const ApiError = require('utils/errors/ApiError');

module.exports = function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.Unauthorized());
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.Unauthorized());
    }

    const userData = TokensService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.Unauthorized());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.Unauthorized());
  }
};
