const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product : String ,
    price : Number ,
    date : Date ,
    id : Number,
    quantity : Number ,
    userId : {
        type : mongoose.ObjectId,
        ref :"User",
        required : [true , 'Please provide user']
    },
})

const ProductTracker = mongoose.model( "ProductTracker" , productSchema);
module.exports = ProductTracker;