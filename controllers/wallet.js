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

    const walletId = { userId : req.user.userId }
    const funds ={ walletBalance : req.body.walletBalance }

    const wallet = await Wallet.findOneAndUpdate(walletId , funds , {
        new : true 
    })

    if (!wallet) {
        throw new CustomAPIError("User does not have wallet")
    }


    console.log(wallet);
    res.status(StatusCodes.OK).json("Wallet has been funded")
}
module.exports = {createWallet , getWallet ,fundWallet}