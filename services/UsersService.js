'use strict';

const TokensService = require('services/TokensService');
const UserDTO = require('dtos/UserDTO');
const ApiError = require('utils/errors/ApiError');
const { UserModel, RefreshTokenModel } = require('models');
const { getPasswordHashWithSalt, comparePasswords } = require('utils/helpers');

class UsersService {
  static async registration(credentials) {
    const { email, password } = credentials;
    const candidate = await UserModel.findOne({ where: { email } });

    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const { salt, passwordHash } = getPasswordHashWithSalt(password);
    const user = await UserModel.create({ email, passwordHash, salt });
    const userDTO = new UserDTO(user);

    const tokens = TokensService.generateTokens({ ...userDTO });
    await TokensService.saveRefreshToken(userDTO.id, tokens.refreshToken);

    return {
      tokens,
      user: userDTO,
    };
  }

  static async authorization(credentials) {
    const { email, password } = credentials;
    const user = await UserModel.findOne({ where: { email } });

    if (!user || !comparePasswords(password, user.passwordHash, user.salt)) {
      throw ApiError.BadRequest('Неверно введен email или пароль');
    }

    const userDTO = new UserDTO(user);

    const tokens = TokensService.generateTokens({ ...userDTO });
    await TokensService.saveRefreshToken(userDTO.id, tokens.refreshToken);

    return {
      tokens,
      user: userDTO,
    };
  }

  static async logout(refreshToken) {
    return RefreshTokenModel.destroy({ where: { refreshToken } });
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.BadRequest('Отстутсвует refresh token');
    }

    const userDataFromToken = TokensService.validateRefreshToken(refreshToken);

    if (!userDataFromToken) {
      throw ApiError.Unauthorized();
    }

    const refreshTokenFromDB = TokensService.findRefreshToken(refreshToken);

    if (!refreshTokenFromDB) {
      throw ApiError.Unauthorized();
    }

    const user = await UserModel.findByPk(userDataFromToken.id);
    const userDTO = new UserDTO(user);

    const tokens = TokensService.generateTokens({ ...userDTO });
    await TokensService.saveRefreshToken(userDTO.id, tokens.refreshToken);

    return {
      tokens,
      user: userDTO,
    };
  }

  static async whoami(userId) {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден');
    }

    return new UserDTO(user);
  }
}

module.exports = UsersService;
