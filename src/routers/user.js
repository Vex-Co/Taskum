const User = require('../models/users')
const express = require('express')
const router = new express.Router()

//--------------------------------
//        User API Routes
//--------------------------------
// Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredantials(req.body.email, req.body.password)
        user.generateAuthToken()
        user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
// Signup for New Users
router.post('/users', async ({body:user}, res) => {
    const newUser = new User(user)

    try {
        newUser.generateAuthToken();
        await newUser.save();
        res.status(201).send(newUser)
    } catch (e) {
        res.status(400).send()
    }
})
// Fetch All existing users.
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(404).send(e)
    }
})
// Fetch User by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
        throw new Error()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})
// Delete User By ID
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const deletedUser = await User.findByIdAndDelete({_id})

        if (!deletedUser) {
        throw new Error()
        }
        res.status(200).send(deletedUser)
    } catch (e) {
        res.status(400).send()
    }
})
// Update Existing User.
router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password']

    const isValid = updates.every((value) => allowedUpdates.includes(value))
    if (!isValid) {
        return res.status(400).send({error: 'Please Provide the correct parameters to update.'})
    }

    try {
        const user = await User.findById(_id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()

        res.status(200).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router