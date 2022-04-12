const express = require('express');
const User = require('./models/users')
const Task = require('./models/tasks');
const { findByIdAndDelete } = require('./models/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//--------------------------------
//        User API Routes
//--------------------------------
// Fetch All existing users.
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(404).send(e);
  }
});
// Fetch User by id
app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new Error();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});
// Create New User.
app.post('/users', async ({body:user}, res) => {
  const newUser = new User(user);

  try {
    await newUser.save();
    user.msg = "Successfully Added New User.";
    res.status(201).send(user);
  } catch (e) {
    res.status(500).send();
  }
});
// Delete User By ID
app.post('/users/delete/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete({_id});

    if (!deletedUser) {
      throw new Error();
    }
    res.status(200).send(deletedUser);
  } catch (e) {
    res.status(400).send();
  }
});
//--------------------------------
//       Task API Routes
//--------------------------------
// Fetch All existing tasks.
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send();
  }
});
// Fetch User by id
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      throw new Error();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send();
  }
});
// Create New Task
app.post('/tasks', async ({ body:task = '' }, res) => {
  const newTask = new Task(task);

  try {
    await newTask.save();
    task.msg = "Successfully added new task.";
    res.status(201).send(task); //send response
  } catch (e) {
    res.status(400).send();
  } 
});
// Delete Task By ID
app.post('/tasks/delete/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete({_id:_id});

    if (!deletedTask) {
      throw new Error();
    }

    res.status(200).send(deletedTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});