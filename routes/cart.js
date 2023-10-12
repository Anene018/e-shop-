const express = require('express')
const router = express.Router()
const { addCart , getCart , removeItem ,  increaseItem ,  checkOutItem} = require('../controllers/cart')
const auth = require('../middleware/authentication')

//route handler
router.route('/getcart').get(  auth , getCart )
router.route('/:id/remove').delete(  auth , removeItem )
router.route('/:id/increase').patch(  auth , increaseItem )
router.route('/:id/addcart').post(  auth , addCart )
router.route('/checkout').get(  auth , checkOutItem )




module.exports = router