const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({
    walletNumber : {
        type : Number,
        required : [true , 'Please put in number'] ,
        unique : true
    } ,
    walletBalance : {
        type :Number,
        default : 0 
        
    } ,
    bankCode : {
        type : String,
        required : [ true , 'Please provide bank code']
    },
    userId : {
        type : mongoose.ObjectId,
        ref :"User",
        required : [true , 'Please provide user']
    }

})

module.exports = mongoose.model("Wallet" , walletSchema)
