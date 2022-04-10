const express = require('express');
const User = require('./models/users')

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});