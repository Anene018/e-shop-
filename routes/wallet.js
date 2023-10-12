const express = require('express')
const router = express.Router()
const {createWallet , getWallet ,fundWallet} = require('../controllers/wallet')
const auth = require('../middleware/authentication')

router.route('/createwallet').post( auth ,createWallet)
router.route('/getwallet').get(auth , getWallet)
router.route('/fundwallet').patch( auth ,fundWallet)


module.exports = router