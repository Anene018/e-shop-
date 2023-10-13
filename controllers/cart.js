const Wallet = require('../models/wallet');
const Cart = require('../models/cart');
const StatusCodes = require('http-status-codes')
const {BadRequestError , UnauthenticatedError , CustomAPIError} = require('../errors');
const fetch = require('node-fetch');
const ProductTracker = require('../models/expenseTracker')


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

    if(id){
        const remove = await Cart.deleteOne({ id , userId})
        res.status(StatusCodes.OK).json("Item has been removed from chart")
    } else {
        const cart = await Cart.deleteMany({ userId })
        res.status(StatusCodes.OK).json(" All items in cart has been cleared ")
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


const checkOutItem = async ( req , res ) => {
    try {
        const userId = req.user.userId
        const id = req.body.id
        
        let cartItems = [] 
        if(id){
            const cartItem = await Cart.findOne({id})
            if(!cartItem){
                throw new Error ("Item is not in your cart")
            }
            if (cartItem){
                cartItems = [cartItem]
            }

        } else {
            cartItems = await Cart.find({userId})
        }

        const wallet = await Wallet.findOne({userId})
        const walletBalance = wallet.walletBalance
        if(!wallet){
            throw new Error ("User does not have wallet")
        }

        const totalPrice = cartItems.reduce((total , product) => total + product.price * product.quantity , 0);

        if(walletBalance < totalPrice){
            throw new Error ("Insufficient funds")
        }

        const newWalletBalance = walletBalance - totalPrice
        wallet.walletBalance = newWalletBalance
        await wallet.save()

        if(id){
            await Cart.deleteOne({id})
        } else {
            await Cart.deleteMany({userId})
        }

        const expenseTrackers = cartItems.map((cartItem) =>{
            return new ProductTracker({
                product: cartItem.title,
                price : cartItem.price,
                quantity : cartItem.quantity,
                date : new Date(),
                userId
            });
        })

        await ProductTracker.insertMany(expenseTrackers)

        res.status(StatusCodes.OK).json({
            message : "Purchase successfull",
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message : "Error in purchasing product",
            error : error.message
        })
    }    
}

module.exports = {
    addCart,
    getCart,
    removeItem,
    increaseItem,
    checkOutItem
}