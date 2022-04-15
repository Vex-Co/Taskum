const { decode } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')

    try {
        const decoded = jwt.verify(token, 'someSecretKey')
        const _id = decoded._id

        const user = await User.findOne({_id:_id,'tokens.token':token})
        if (!user) {
            throw new Error()
        }
        
        req.user = user
    } catch (e) {
        res.status(401).send({
            error: 'Please Authenticate.'
        })
    }
    next()
}

module.exports = auth