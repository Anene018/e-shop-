const express = require('express')
const router = express.Router();

const { signup , signin , forgotPassword  , verifyOtp , resetPassword} = require('../controllers/auth')

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/forgot-password').post( forgotPassword)
router.route('/verifyotp').post( verifyOtp)
router.route('/resetpassword').patch( resetPassword)



module.exports = router
