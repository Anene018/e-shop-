const User = require('../models/User');
const Cart = require('../models/cart');
const StatusCodes = require('http-status-codes')
const {BadRequestError , UnauthenticatedError , CustomAPIError} = require('../errors');
const fetch = require('node-fetch');


const addCart =  async (req , res ) => {
    try {
        const id = req.params.id;
        const product = await fetch(`https://dummyjson.com/products/${id}`)
    
        if(!product.ok){
            throw new error ("Could not get product")
        }
    
        const data = await product.json();
    
        const userId =  req.user.userId 
    
        const body = {
            userId ,
            ...data
        } 

        const item = await Cart.findOne({ userId , id})
    
        if(!item){
            const cart = await Cart.create(body)
            res.status(StatusCodes.CREATED).json(cart)
        } else {
            res.status(StatusCodes.BAD_REQUEST).json("Item already exist in cart")
        }

        
        
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error : error.message
        })
    }

}

const getCart = async ( req , res ) => {
    try {
        const userId = req.user.userId

        const cart = await Cart.find({ userId })

        res.status(StatusCodes.OK).json(cart)

    } catch (error) {
        throw new error ("User does not have products in cart")
    }

}

const removeItem = async ( req , res ) => {
    const userId = req.user.userId
    const id = req.params.id;
   

    const remove = await Cart.deleteOne({ id , userId})
    res.status(StatusCodes.OK).json("Item has been removed from chart")

}

const removeAll = async ( req , res ) => {

    const userId = req.user.userId;

    const cart = await Cart.deleteMany({ userId })

    res.status(StatusCodes.OK).json(" All items in cart has been cleared ")
}

const decreaseItem = async ( req ,res ) => {
    const userId = req.user.userId;
    const id = req.params.id;
    const quantity = req.body.quantity;

    if( quantity >= 10){
        return res.status(StatusCodes.BAD_REQUEST).json("Cannot order more than 10 items")
    }

    if (quantity <= 0 ) {
        const item = await Cart.findOneAndDelete({userId , id})
        return res.status(StatusCodes.OK).json("Item has been removed")
    }

    const item = await Cart.findOne({ id , userId })

    if(!item){
        return res.status(StatusCodes.BAD_REQUEST).json("Item does not exist")
    }

    try {
        item.quantity = quantity;
        await item.save(); 
        res.json(item)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message
        })
    }

    
}

const increaseItem = async ( req ,res ) => {
    const userId = req.user.userId;
    const id = req.params.id;
    const quantity = req.body.quantity;

    if( quantity > 10){
        return res.status(StatusCodes.BAD_REQUEST).json("Cannot order more than 10 items")
    }

    if (quantity <= 0 ) {
        const item = await Cart.findOneAndDelete({userId , id})
        return res.status(StatusCodes.OK).json("Item has been removed")
    }

    const item = await Cart.findOne({ id , userId })

    if(!item){
        return res.status(StatusCodes.BAD_REQUEST).json("Item does not exist")
    }

    try {
        item.quantity = quantity;
        await item.save(); 
        res.json(item)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: error.message
        })
    }

}
module.exports = {
    addCart,
    getCart,
    removeAll,
    removeItem,
    decreaseItem,
    increaseItem,
}