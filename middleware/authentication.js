const User = require('../models/User')
const jwt = require('jsonwebtoken')
const util = require('util')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  
  let token ;
  if(authHeader && authHeader.startsWith('Bearer ')){
    token = authHeader.split(' ')[1]
  }
  if(!token){
    throw new UnauthenticatedError('Please login')
  }
  const decoded = await util.promisify( jwt.verify)(token , process.env.SECRET_STR)
 
  // validating user
  const user = await User.findById(decoded.id);

  if(!user){
    throw new UnauthenticatedError("User does not exist")
  }

  const isPasswordChanged = await user.isPasswordChanged(decoded.iat)
  if(isPasswordChanged){
    throw new UnauthenticatedError(" Wrong password ")
  }

  req.user = {
    userId : decoded.id
  }
  next();
}

module.exports = auth
