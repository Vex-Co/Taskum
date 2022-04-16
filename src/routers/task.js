const Task = require('../models/tasks');
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/users');

const router = new express.Router();

//--------------------------------
//       Task API Routes
//--------------------------------
// Fetch All existing tasks.
router.get('/tasks', auth,  async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tasks')

    res.status(200).send(user.tasks);
  } catch (e) {
    res.status(400).send();
  }
});
// Create New Task
router.post('/tasks', auth, async (req, res) => {
  const newTask = new Task({
      ...req.body,
      owner: req.user._id
  });

  try {
    await newTask.save();
    res.status(201).send(newTask); //send response
  } catch (e) {
    res.status(400).send(e);
  } 
});
// Update Existing Task.
router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];

  const isValid = updates.every((value) => allowedUpdates.includes(value));
  if (!isValid) {
    return res.status(400).send({error: 'Please Provide the correct parameters to update.'});
  }

  try {
    const task = await Task.findById(_id);
    updates.forEach (update => {
      task[update] = req.body[update];
    })
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});
// Delete Task By ID
router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router;