const User = require('../models/User')
const Wallet = require('../models/wallet')
const StatusCodes = require('http-status-codes')
const {BadRequestError , UnauthenticatedError , CustomAPIError} = require('../errors')


const createWallet = async (req , res ) => {
    
   try {
    const userId = req.user.userId
    const user = await User.findById(userId)
    .populate('walletDetails')
    .populate('cart')

   
    if(!user.walletDetails){

        const data = {
            userId , 
            ...req.body
        }

        const wallet = await Wallet.create(data);

        user.walletDetails = wallet._id
        await user.save()

        return res.status(StatusCodes.CREATED).json(wallet);
        
    }else {
        throw new CustomAPIError("User already has wallet")
    }
   } catch (error) {
        
        return res.status(StatusCodes.BAD_REQUEST).json({
            error : error.message
        })
   }


}

const getWallet = async (req , res) => {
    const wallet = await Wallet.findOne({ userId : req.user.userId})

    if (!wallet) {
        throw new CustomAPIError("User does not have wallet")
    }

    res.status(StatusCodes.OK).json(wallet)
}

const fundWallet = async (req , res) => {

    const userId = req.user.userId
    const wallet = await Wallet.findOne({ userId })
    if (!wallet) {
        throw new CustomAPIError("User does not have wallet")
    }
    const funds = req.body.walletBalance 
    const newBalance = funds + wallet.walletBalance
    wallet.walletBalance = newBalance
    await wallet.save();

    console.log(newBalance);
    res.status(StatusCodes.OK).json({
        message : "Wallet has been funded"
    })
}
module.exports = {createWallet , getWallet ,fundWallet}