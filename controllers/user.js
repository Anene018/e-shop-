const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const {BadRequestError , UnauthenticatedError , CustomAPIError} = require('../errors')
//const picture = require('../ProfilePhoto')

const getUser = async (req , res , next ) => {
    const name = req.user
    const user = await User.findOne(name)

    if(!user){
        throw new CustomAPIError("No user with name")
    }

    res.status(StatusCodes.OK).json({
        user
    })
}

const addPhoto = async (req , res) => {

    const name = req.user 
    const user = await User.findOne(name)

    if(!user){
        throw new UnauthenticatedError("No user with name")
    }



    res.send('You ugly')
}

module.exports = {getUser , addPhoto }