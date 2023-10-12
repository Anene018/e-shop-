const express = require('express')
const router = express.Router()
const {getUser , addPhoto} = require('../controllers/user')
const auth = require('../middleware/authentication')

router.route('/getuser').get(getUser,auth)
router.route('/addphoto').patch(auth , addPhoto)
//router.route('/createwallet').post(createWallet,auth)


module.exports = router