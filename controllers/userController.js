'use strict';

const UsersService = require('services/UsersService');

const registration = async (credentials) =>
  UsersService.registration(credentials);

const authorization = async (credentials) =>
  UsersService.authorization(credentials);

const logout = async (freshToken) => UsersService.logout(freshToken);

const refresh = async (freshToken) => UsersService.refresh(freshToken);

const whoami = async (useId) => UsersService.whoami(useId);

module.exports = { registration, authorization, logout, refresh, whoami };
