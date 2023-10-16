const express = require('express')
const router = express.Router()
const {getUser } = require('../controllers/user')
const auth = require('../middleware/authentication')
const {uploadFile , uploadImage} = require('../controllers/upload')


router.route('/getuser').get(auth , getUser)
router.route('/addphoto').post(auth , uploadImage , uploadFile )


module.exports = router