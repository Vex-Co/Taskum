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
        const token = await user.generateAuthToken()
        user.save()
        res.send({user,token})
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
        const token = await newUser.generateAuthToken();
        await newUser.save();
        res.status(201).send({newUser, token})
    } catch (e) {
        res.status(400).send()
    }
})
// Show Profile (logged in user).
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})
// Delete logged in user
router.delete('/users/me',auth , async (req, res) => {
    try {
        const deletedUser = await req.user.remove()
        res.status(200).send(deletedUser)
    } catch (e) {
        res.status(400).send()
    }
})
// Update Existing User.
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']

    const isValid = updates.every((value) => allowedUpdates.includes(value))
    if (!isValid) {
        return res.status(400).send({error: 'Please Provide the correct parameters to update.'})
    }

    try {
        const user = req.user
        console.log(user)
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