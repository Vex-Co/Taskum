const express = require('express');
const User = require('./models/users')
const Task = require('./models/tasks')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// User API Routes
app.post('/user', (req, res) => {
  const newUser = new User(req.body);

  newUser.save().then(() => {
    res.send(req.body);
  }).catch(error => {
    res.status(400).send(error);
  })
});

// Task API Routes
app.post('/task', ({ body:task = '' }, res) => {
  const newTask = new Task(task);

  newTask.save().then(() => {
    task.status = "Successfully Added this task.";
    res.send(task); //send response
  }).catch(error => {
    res.status(400).send(error);
  })
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});