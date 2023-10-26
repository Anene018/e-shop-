const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

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
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', 
    },
    walletDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',  
    },
    
    passwordResetToken : String 

},
{timestamps : true})


userSchema.pre('save' , async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 10);
    next();
})

userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};


module.exports= mongoose.model("User" , userSchema)
