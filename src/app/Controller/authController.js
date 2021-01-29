const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const router = express.Router();

function genetateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
}

router.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }
    const user = await User.create(req.body);
    user.password = undefined;
    return res.send({ user, token: genetateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" })
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: "Invalid password" });
  }
  user.password = undefined;

  res.send({ user, token: genetateToken({ id: user.id }), });
});

router.post('/forgotten_password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).send({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });
    console.log(token, now);
    mailer.sendMail({
      to: email,
      from: "iplsofthouse@iplsofthouse.com",
      template: 'auth/forgot_password',
      context: { token },
    })
  } catch (err) {
    res.status(400).send({ error: "Error on forgotten password, try again later" });
  }
});

module.exports = app => app.use('/auth', router);