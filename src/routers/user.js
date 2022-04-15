const User = require('../models/users')
const express = require('express')
const auth = require('../middleware/auth')  // Middleware

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
// Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => req.token != token.token)
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
// Logout All - logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send()
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
// Fetch Me (logged in user).
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
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