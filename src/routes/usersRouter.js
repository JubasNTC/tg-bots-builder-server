'use strict';

const express = require('express');

const asyncHandler = require('utils/asyncHandler');
const { signIn } = require('controllers/userController');

const router = express.Router();

router.post(
  '/sign-in',
  asyncHandler(async (req, res) => {
    await signIn();
    res.sendStatus(200);
  })
);

module.exports = router;
