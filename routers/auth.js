const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/user');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return res.status(400).send(errors);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).send({ top: 'User not found' });

  if (!user.isConfirmed)
    return res.status(400).send({ top: 'User is not confirmed' });

  const result = await bcrypt.compare(req.body.password, user.password);

  if (!result)
    return res.status(400).send({ password: '"password" is incorrect' });

  const jwt = user.generateAuthToken();
  res.status(200).send(jwt);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

module.exports = router;
