const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {  
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_PASSWORD_KEY)
        const _id = decoded._id

        const user = await User.findOne({_id:_id,'tokens.token':token})
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        
        next()
    } catch (e) {
        res.status(401).send({
            error: 'Please Authenticate.',
        })
    }
}

module.exports = auth