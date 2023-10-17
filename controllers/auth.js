const User = require('../models/User')
const { StatusCodes } = require('http-status-codes');
const {BadRequestError , UnauthenticatedError , CustomAPIError} = require('../errors')
const jwt = require('jsonwebtoken')
const sendEmail = require('../services/email')
const { generateKey } = require('../services/otp');
const bcrypt = require('bcryptjs')
const speakeasy = require('speakeasy')


const signToken = (id , name ) => {
    return jwt.sign({ id , name } , process.env.SECRET_STR , {
        expiresIn : process.env.TOKEN_EXP
    })
}

const signup = async (req , res ) => {
   
    const newUser = await User.create({...req.body}); 
    const token = signToken(newUser._id , newUser.name)

    res.status(StatusCodes.CREATED).json({
        token,
        user : {
            name : newUser.name
        }
    })
}

const signin = async (req , res ) => {
    const email  = req.body.email
    const password = req.body.password
    
    if(!email || !password){
       throw new BadRequestError(" Input login details " ) 
    }

    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError("User does not exist")
    }
    
    const isPasswordCorrect = await user.comparePassword(password);
  
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("In correct password ")
    }

    const token = signToken(user._id , user.name )
    res.status(StatusCodes.OK).json({ token })
}

const forgotPassword = async (req , res ) => {

    const user = await User.findOne({ email : req.body.email }) 
    if(!user){
        throw new UnauthenticatedError(" No user with given email")
    }

    // const resetToken = await user.createResetPasswordToken();
    // await user.save({ validateBeforeSave : false });

    // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/:${resetToken}`
    // const message = ` Use the link below to reset your password. If you did not request please ignore the email \n \n ${resetUrl} \n \n link is valid for 10 minutes`;

    const verificationInfo =  (await generateKey());
    const message = `Your verification OTP for e-shop is \n \n ${verificationInfo.otp}  \n \n  it last for % minutes`
    
    try {
        await sendEmail({
            email : user.email,
            subject : 'Reset password verification',
            text : message
        });

        res.status(StatusCodes.OK).json({
            message : ' OTP sent to your email'
        })
    } catch (error) {
        user.passwordResetToken = undefined,
        user.passwordResetTokenExpires = undefined,
        user.save({validateBeforeSave : false})

        throw new CustomAPIError('Email not sent')
    }
}
const resetPassword = async (req , res ) => {
    const { otp , password , email } = req.body
    const user = await User.findOne(email)
    if(!user){
        throw new BadRequestError('No user with email')
    }

    const secret = 3;
    const isVerified  = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: otp,
        window: 6
      });

      if(!isVerified){
        throw new UnauthenticatedError ("Invalid otp")
      }
    
    user.password = await bcrypt.hash( password , 10) ;

    await user.save();

    const loginToken = signToken(user._id , user.name)

    res.status(StatusCodes.CREATED).json({
        loginToken,
        user : {
            name : user.name
        }
    })
}


const getUser = async (req , res  ) => {
    const name = req.body
    const user = await User.findOne(name)
    if(!user){
        throw new UnauthenticatedError("No user with name")
    }

    res.status(StatusCodes.OK).json({
        user : {
            name : user.name,
            email : user.email
        }
    })
}


module.exports = {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    getUser
}