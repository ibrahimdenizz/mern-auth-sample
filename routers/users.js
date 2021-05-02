const auth = require('../middlewares/auth');
const { User, validate } = require('../models/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const serverUrl =
  process.env.NODE_ENV === 'production'
    ? config.get('url')
    : 'http://localhost:5000';

const transporter = nodemailer.createTransport({
  service: config.get('emailService'),
  auth: {
    user: config.get('emailUser'),
    pass: config.get('emailPass'),
  },
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v -_id');

  if (!user) return res.status(404).send({ top: 'Please login' });

  res.status(200).send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return res.status(400).send(errors);
  }
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send({ top: 'User already registerd' });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      isConfirmed: false,
    });

    const token = jwt.sign({ email: user.email }, config.get('emailSecretKey'));

    const url = `${serverUrl}/api/confirm/register/${token}`;
    const message = {
      from: config.get('emailUser'),
      to: req.body.email,
      subject: 'Confirm Email',
      html: `Please click url to confirm your email: <br/> <br/> <a href="${url}">${url}<a>`,
    };

    await transporter.sendMail(message);
    user = await user.save();

    res.status(200).send({ success: 'User is succesfully registered' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ top: 'Something goes wrong. Please try again later' });
  }
});

router.post('/edit', auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(5).max(50).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ name: error.details[0].message });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
    }).select('-password');

    if (!user) {
      return res
        .status(404)
        .send({ top: 'Something goes wrong. Please try again later' });
    }

    res.status(200).send({
      user: { name: req.body.name, email: user.email },
      success: 'Profile updated successfully',
    });
  } catch (err) {
    res
      .status(500)
      .send({ top: 'Something goes wrong. Please try again later' });
  }
});

router.post('/change-email', auth, async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(100).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status({ email: error.details[0].message });
  }

  const user = await User.findById(req.user._id);

  if (!user)
    return res
      .status(404)
      .send({ top: 'Something goes wrong. Please try again later' });

  try {
    const token = jwt.sign(
      { _id: user._id, email: req.body.email },
      config.get('emailSecretKey')
    );

    const url = `${serverUrl}/api/confirm/new-email/${token}`;

    const message = {
      from: config.get('emailUser'),
      to: user.email,
      subject: 'New Email Confirmation',
      html: `<p>Please click link to change your email address</p> <br/> <br/> <a href=${url}>${url}</a> <br/> <br/> <strong>If you don't know about it, Please change your password</strong> `,
    };

    await transporter.sendMail(message);

    res.status(200).send({
      warning: `Please check your email(${user.email})'s mailbox for confirmation mail.`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ top: 'Something goes wrong, please try again later.' });
  }
});

router.post('/change-password', auth, async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(5).max(50).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status({ password: error.details[0].message });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.user._id, { password: hash });

    if (!user)
      return res
        .status(404)
        .send({ top: 'Something goes wrong. Please try again later' });

    const token = user.generateAuthToken();

    const url = `${config.get('url')}/reset-password/${token}`;

    const message = {
      from: config.get('emailUser'),
      to: user.email,
      subject: 'Your Password has been changed',
      html: `<p>Your password has been changed, If you did not change your password, please click the link to reset your password</p> <br/> <br/> <a href=${url} >${url}</a>`,
    };

    await transporter.sendMail(message);

    res.status(200).send({ success: 'Password is successfully updated' });
  } catch (err) {
    res
      .status(500)
      .send({ top: 'Something goes wrong, please try again later.' });
  }
});

router.post('/reset-password', auth, async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(5).max(50).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status({ password: error.details[0].message });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.user._id, { password: hash });

    if (!user)
      return res
        .status(404)
        .send({ top: 'Something goes wrong. Please try again later' });

    res.status(200).send({ success: 'Password is successfully updated' });
  } catch (err) {
    res
      .status(500)
      .send({ top: 'Something goes wrong, please try again later.' });
  }
});

module.exports = router;
