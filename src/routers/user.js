const User = require('../models/users')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const email = require('../emails/account')
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

        const firstName = newUser.name.split(' ')[0]
        // Send Welcome Email
        email.sendEmail({
            email: newUser.email,
            subject: `Welcome ${firstName}`,
            text: `Welcome to Taskum, ${firstName}. We are happy to see your intrest toward organizing your life 😊. Wish you all the best.`
        })
        res.status(201).send({newUser, token})
    } catch (e) {
        res.status(400).send(e)
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

        const firstName = deletedUser.name.split(' ')[0]
        email.sendEmail({
            email: deletedUser.email,
            subject: `Hello ${firstName}`,
            text: "It's very sad to see you leaving us. \
                   I hope you are doing great in your life. \
                   See you soon. Wish you all the best."
        })
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
// Upload Avatar
const uploads = multer({
    limits: {
        fileSize: 1000000 // 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return cb(new Error('Please Upload an Image (.jpg, .png, .jpeg)'))
        }
        cb(null, true)
    }
})
router.post('/users/me/avatar', auth, uploads.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error:error.message})
})
// Delete Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
// Show Avatar By ID
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
    
        if (!user) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router