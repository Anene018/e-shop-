const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const crypto = require('crypto')
const { jwt } = require('jsonwebtoken')


const userSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : [true , ' Fill in name']
    },
    email : {
        type : String ,
        required : [ true , "Please put in email"],
        validate : [validator.isEmail , "Please put in valid email" ],
        unique : true
    },
    profilepicture : String,
    password : {
        type : String,
        required : [true , "Please put in password"] ,
        minlength : 8,
        select : false
    },

    cart : {
        type : mongoose.ObjectId,
        ref :"Cart"
    },
    walletDetails : {
        type : mongoose.ObjectId,
        ref :"Wallet"
    },
    // confirmpassword : {
    //     type : String ,
    //     required : [true , "Please put in password"],
    //     minlength : 8,
    //     validate :{
    //         validator : function(value) {
    //            return value == this.password
    //         },
    //         message :" Password does not match"
    //     }
        
    // },
    
    passwordResetToken : String ,
    passwordResetTokenExpires : Date

},
{timestamps : true})


userSchema.pre('save' , async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 10);

    next();
})

// userSchema.methods.comparePassword = async function (pass , passdb) {
//     return await bcrypt.compare(pass , passdb)
// }

userSchema.methods.isPasswordChanged = async function (jwtTimeStamp){
    if(this.passwordChangedAt){

        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
       
        return   jwtTimeStamp < passwordChangedTimestamp

    }
    return false
}

userSchema.methods.createResetPasswordToken = async function () {

   const resetToken = crypto.randomBytes( 32 ).toString('hex')
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
   this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

   console.log( resetToken , this.passwordResetToken);

   return resetToken;
}

module.exports= mongoose.model("User" , userSchema)

