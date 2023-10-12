const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    id : Number ,
    title : String ,
    price : Number ,
    category : String ,
    description : String,
    images : [ String ] ,
    userId : {
        type : mongoose.ObjectId,
        ref :"User",
        required : [true , 'Please provide user']
    },
    quantity : {
        type : Number ,
        default : 1 ,
        maxlength : [ 10 , 'Cannot have more than 10 of the items'],
        minlength : [0 , 'Cannot go below 0']
    } ,            

})              

const Cart = mongoose.model("Cart" , cartSchema)

module.exports = Cart