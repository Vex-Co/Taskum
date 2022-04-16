const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {  
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'someSecretKey')
        const _id = decoded._id

        const user = await User.findOne({_id:_id,'tokens.token':token})
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
    } catch (e) {
        res.status(401).send({
            error: 'Please Authenticate.',
        })
    }
    next()
}

module.exports = auth