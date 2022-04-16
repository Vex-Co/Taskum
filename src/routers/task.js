const Task = require('../models/tasks')
const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

//--------------------------------
//       Task API Routes
//--------------------------------
// Fetch All tasks of Current User
router.get('/tasks', auth,  async (req, res) => {
  try {
    const user = await req.user.populate('tasks')

    res.status(200).send(user.tasks)
  } catch (e) {
    res.status(400).send()
  }
})
// Fetch Task by id (only those belong to to that user)
router.get('/tasks/:id', auth,  async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) throw new Error() // if no task found

    res.status(200).send(task)
  } catch (e) {
    res.status(404).send()
  }
})
// Create New Task
router.post('/tasks', auth, async (req, res) => {
  const newTask = new Task({
      ...req.body,
      owner: req.user._id
  })

  try {
    await newTask.save()
    res.status(201).send(newTask) //send response
  } catch (e) {
    res.status(400).send(e)
  } 
})
// Update Existing Task.
router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  const isValid = updates.every((value) => allowedUpdates.includes(value))
  if (!isValid) {
    return res.status(400).send({error: 'Please Provide the correct parameters to update.'})
  }

  try {
    const task = await Task.findOne({_id, owner: req.user._id})
    
    if (!task) throw new Error() // if no task found

    updates.forEach (update => {
      task[update] = req.body[update]
    })
    await task.save()
    res.status(200).send(task)
  } catch (e) {
    res.status(404).send(e)
  }
})
// Delete Task By ID
router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const deletedTask = await Task.findByIdAndDelete({_id, owner: req.user._id })

    if (!deletedTask) throw new Error()

    res.status(200).send(deletedTask)
  } catch (e) {
    res.status(404).send(e)
  }
})

module.exports = router