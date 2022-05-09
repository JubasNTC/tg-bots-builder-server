'use strict';

const jwt = require('jsonwebtoken');

const { RefreshTokenModel } = require('models');

class TokensService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      algorithm: 'HS512',
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      algorithm: 'HS512',
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async saveRefreshToken(userId, refreshToken) {
    const tokenData = await RefreshTokenModel.findOne({
      where: { userId },
    });

    if (tokenData) {
      return RefreshTokenModel.update({ refreshToken }, { where: { userId } });
    }

    return RefreshTokenModel.create({ userId, refreshToken });
  }

  static async findRefreshToken(refreshToken) {
    return RefreshTokenModel.findOne({
      where: { refreshToken },
    });
  }

  static validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return null;
    }
  }

  static validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return null;
    }
  }
}

module.exports = TokensService;
