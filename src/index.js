const express = require('express');
const User = require('./models/users')
const Task = require('./models/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//--------------------------------
//        User API Routes
//--------------------------------
// Fetch All existing users.
app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch((e) => {
    res.status(404).send();
  });
});
// Fetch User by id
app.get('/users/:id', (req, res) => {
  const _id = req.params.id;

  User.findById(_id).then((user) => {
    res.send(user);
  }).catch((e) => {
    res.send(e);
  });
});
// Create New User.
app.post('/users', ({body:user}, res) => {
  const newUser = new User(user);

  newUser.save().then(() => {
    user.status = "Successfully added new user.";
    res.status(201).send(user); //send response
  }).catch((error) => {
    res.status(400).send(error);
  })
});
// Delete User By ID
app.post('/users/delete/:id', (req, res) => {
  const _id = req.params.id;
  User.findByIdAndDelete({_id:_id}).then((deletedUser) => { // on Success
    if (!deletedUser) { // when task not found
      deletedUser = {error : 'No user found with this id.'}
    }
    res.status(200).send(deletedUser);
  }).catch(e => { // On Error
    console.log(e);
    res.status(500).send({
      error: 'Please provide correct id.'
    });
  })
});
//--------------------------------
//       Task API Routes
//--------------------------------
// Fetch All existing tasks.
app.get('/tasks', (req, res) => {
  Task.find({}).then((tasks) => {
    res.send(tasks);
  }).catch((e) => {
    res.status(404).send();
  });
});
// Fetch User by id
app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id;

  Task.findById(_id).then((task) => {
    res.send(task);
  }).catch((e) => {
    res.send(e);
  });
});
// Create New Task
app.post('/tasks', ({ body:task = '' }, res) => {
  const newTask = new Task(task);

  newTask.save().then(() => {
      task.status = "Successfully added new task.";
      res.status(201).send(task); //send response
  }).catch(error => {
    res.status(400).send(error);
  })
});
// Delete Task By ID
app.post('/tasks/delete/:id', (req, res) => {
  const _id = req.params.id;
  Task.findByIdAndDelete({_id:_id}).then((deletedTask) => { // on Success
    if (!deletedTask) { // when task not found
      deletedTask = {error : 'No task found with this id.'}
    }
    res.status(200).send(deletedTask);
  }).catch(e => { // On Error
    console.log(e);
    res.status(500).send({
      error: 'Please provide correct id.'
    });
  })
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});