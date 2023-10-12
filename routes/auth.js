const express = require('express')
const router = express.Router();

const { signup , signin , forgotPassword , resetPassword } = require('../controllers/auth')
//const {  } = require('../controllers/user')

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/forgot-password').post( forgotPassword)
router.route('/reset-password/:token').patch(resetPassword)


module.exports = router
