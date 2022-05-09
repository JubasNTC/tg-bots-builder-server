'use strict';

const crypto = require('crypto');

const hashingPasswordConfig = {
  digest: 'sha512',
  encoding: 'hex',
  saltSize: 64,
  iterations: 10000,
  keyLength: 128,
};

const getPasswordHashWithSalt = (password) => {
  const salt = crypto
    .randomBytes(hashingPasswordConfig.saltSize)
    .toString(hashingPasswordConfig.encoding);
  const passwordHash = crypto
    .pbkdf2Sync(
      password,
      salt,
      hashingPasswordConfig.iterations,
      hashingPasswordConfig.keyLength,
      'sha512'
    )
    .toString(hashingPasswordConfig.encoding);

  return {
    salt,
    passwordHash,
  };
};

const comparePasswords = (receivedPassword, originalPasswordHash, salt) => {
  const receivedPasswordHash = crypto
    .pbkdf2Sync(
      receivedPassword,
      salt,
      hashingPasswordConfig.iterations,
      hashingPasswordConfig.keyLength,
      'sha512'
    )
    .toString(hashingPasswordConfig.encoding);

  return receivedPasswordHash === originalPasswordHash;
};

module.exports = { getPasswordHashWithSalt, comparePasswords };
