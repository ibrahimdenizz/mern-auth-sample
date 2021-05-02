const { User } = require('../models/user');
const config = require('config');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(100).required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ email: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).send({ top: 'No user has given email.' });

  try {
    const transporter = nodemailer.createTransport({
      service: config.get('emailService'),
      auth: {
        user: config.get('emailUser'),
        pass: config.get('emailPass'),
      },
    });

    const token = user.generateAuthToken();

    const url = `${config.get('url')}/reset-password/${token}`;

    const message = {
      from: config.get('emailUser'),
      to: user.email,
      subject: 'Reset Password',
      html: `<p>Please clicl the link to reset your password</p> <br/> <br/> <a href=${url} >${url}</a>`,
    };

    await transporter.sendMail(message);

    res.status(200).send({ warning: 'Please check your mail box' });
  } catch (err) {
    res
      .status(500)
      .send({ top: 'Something went wrong, please try again later' });
  }
});

module.exports = router;
