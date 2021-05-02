const forgotPassword = require('./routers/forgotPassword');
const users = require('./routers/users');
const auth = require('./routers/auth');
const confirmation = require('./routers/confirmation');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/authProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to DB');
  });

app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/confirm', confirmation);
app.use('/api/forgot-password', forgotPassword);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
