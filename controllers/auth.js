const User = require('../models/User')
const { StatusCodes } = require('http-status-codes');
const {BadRequestError , UnauthenticatedError , CustomAPIError} = require('../errors')
const jwt = require('jsonwebtoken')
const sendEmail = require('../services/email')
const { generateKey  } = require('../services/otp');
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
try {
        const user = await User.findOne({ email : req.body.email }) 
        if(!user){
            throw new UnauthenticatedError(" No user with given email")
        }
    
        // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/:${resetToken}`
        // const message = ` Use the link below to reset your password. If you did not request please ignore the email \n \n ${resetUrl} \n \n link is valid for 10 minutes`;
    
        const verificationInfo =  await generateKey();
        user.passwordResetToken = verificationInfo.secret;
        await user.save({ validateBeforeSave : false})
        const message = `Your verification OTP for e-shop is \n \n ${verificationInfo.otp}  \n \n  it last for 5 minutes`
    
        
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
            user.save({validateBeforeSave : false})
    
            throw new CustomAPIError('Email not sent')
        }
        } catch (error) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message : error.message
            })
        }
        
}

const verification = () => {
    let isUserVerified = false
    const verifyOtp = async ( req ,res  ) =>{
        try{
            const {email , otp } = req.body
            const user = await User.findOne({email})
            
            const isVerified = speakeasy.totp.verify({
                secret: user.passwordResetToken,
                encoding: 'base32',
                token: otp,
                window: 20
            });
    
            if (isVerified) { 
                isUserVerified = true
                res.status(200).json({
                    message : "OTP verified",
                    isVerified
                })
            } else {
                throw new UnauthenticatedError("Invalid OTP")
            }
                    
        } catch ( error ){
            throw new UnauthenticatedError("Invalid OTP")
        }
    }
  const isOtpVerified = () =>{
    return isUserVerified
  }    

  return { isOtpVerified , verifyOtp }
}
const { isOtpVerified , verifyOtp } = verification()

const resetPassword = async (req ,res) => {
    const { email, password } = req.body
    const isUserVerified =  isOtpVerified()
    const user = await User.findOne({ email })

    if (isUserVerified){
        user.password = password
        user.passwordResetToken = undefined
        await user.save()

        const token = signToken(user._id , user.name)

        res.status(200).json({
             message:"Password has been reset",
            token,
            name : user.name
        })
    } else {
        throw new UnauthenticatedError("Invalid OTP")
    }

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
    verifyOtp,
    getUser,
    resetPassword
}