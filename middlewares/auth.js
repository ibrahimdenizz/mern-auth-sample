const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token)
    return res.status(401).send({ top: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ top: 'Invalid token' });
  }
};
