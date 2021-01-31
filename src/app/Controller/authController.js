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
    //console.log(token, now);
    mailer.sendMail({
      to: email,
      from: "ivanovich.tigrao@gmail.com",
      subject: "Forgotten Password",
      //template: 'resources/mail/auth/forgot_password',
      //context: { token },
      html: `Hi, ${user.name}. Have you forgot your password? No problem, retrieve your password with this token : ${token}.`,
    }), (err) => {
      if (err) {
        return res.status(400).send({ error: "Cannot sent forgot password email" });
      }
    }
    return res.status(200).send("Done");
  } catch (err) {
    res.status(400).send({ error: "Error on forgotten password, try again later" });
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
    if (!user) {
      res.status(400).send({ error: "User not found" });
    }
    if (token !== user.passwordResetToken) {
      res.status(400).send({ error: "Invalid token" });
    }
    const now = new Date();
    if (now > user.passwordResetExpires) {
      res.status(400).send({ error: "Token expired, please generate a new one" });
    }
    user.password = password;
    await user.save();
    res.send("The reset password succeed");
  } catch (error) {
    res.status(400).send({ error: "can not reset your passord, please try again later" });
  }
});

module.exports = app => app.use('/auth', router);