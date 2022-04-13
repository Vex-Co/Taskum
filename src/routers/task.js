const Task = require('../models/tasks');
const express = require('express');
const router = new express.Router();

//--------------------------------
//       Task API Routes
//--------------------------------
// Fetch All existing tasks.
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send();
  }
});
// Fetch User by id
router.get('/tasks/:id', async (req, res) => {
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
router.post('/tasks', async ({ body:task = '' }, res) => {
  const newTask = new Task(task);

  try {
    await newTask.save();
    task.msg = "Successfully added new task.";
    res.status(201).send(task); //send response
  } catch (e) {
    res.status(400).send();
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
    const task = await Task.findByIdAndUpdate(_id, req.body, {new:true, runValidators: true});
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