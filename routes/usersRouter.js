'use strict';

const express = require('express');

const userController = require('controllers/userController');
const authMiddleware = require('middlewares/authMiddleware');
const asyncHandler = require('utils/asyncHandler');
const { registrationSchema } = require('utils/validators/userValidator');

const router = express.Router();

router.post(
  '/registration',
  asyncHandler(async (req, res) => {
    const { body } = req;

    const credentials = registrationSchema.validateSync(body);
    const {
      tokens: { accessToken, refreshToken },
      user,
    } = await userController.registration(credentials);

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ accessToken, user });
  })
);

router.post(
  '/authorization',
  asyncHandler(async (req, res) => {
    const { body } = req;

    const credentials = registrationSchema.validateSync(body);
    const {
      tokens: { accessToken, refreshToken },
      user,
    } = await userController.authorization(credentials);

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ accessToken, user });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    await userController.logout(refreshToken);

    res.clearCookie('refreshToken');
    res.sendStatus(200);
  })
);

router.get(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken: oldRefreshToken } = req.cookies;

    const {
      tokens: { accessToken, refreshToken: newRefreshToken },
      user,
    } = await userController.refresh(oldRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ accessToken, user });
  })
);

router.get(
  '/whoami',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const user = await userController.whoami(id);

    res.json({ user });
  })
);

module.exports = router;
