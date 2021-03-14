const config = require('config')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const router = require('express').Router()

router.get('/register/:token', async (req, res) => {
  const token = req.params.token

  if (!token) return res.redirect(config.get('url') + '/not-found')

  try {
    const data = jwt.verify(token, config.get('emailSecretKey'))

    await User.findOneAndUpdate({ email: data.email }, { isConfirmed: true })
    res.redirect(config.get('url') + '/login')
  } catch (err) {
    res.redirect(config.get('url') + '/invalid-token')
  }
})

router.get('/new-email/:token', async (req, res) => {
  const token = req.params.token

  if (!token) return res.redirect(config.get('url') + '/not-found')

  try {
    const data = jwt.verify(token, config.get('emailSecretKey'))

    await User.findByIdAndUpdate(data._id, { email: data.email })

    res.redirect(config.get('url') + '/login')
  } catch (err) {
    res.redirect(config.get('url') + '/invalid-token')
  }
})

module.exports = router
