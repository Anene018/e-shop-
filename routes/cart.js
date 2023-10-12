const express = require('express')
const router = express.Router()
const { addCart , getCart , removeAll , removeItem , decreaseItem , increaseItem} = require('../controllers/cart')
const auth = require('../middleware/authentication')

//route handler
router.route('/getcart').get(  auth , getCart )
router.route('/clearcart').delete(  auth , removeAll )
router.route('/:id/remove').delete(  auth , removeItem )
router.route('/:id/increase').patch(  auth , increaseItem )
router.route('/:id/reduce').patch(  auth , decreaseItem )
router.route('/:id/addcart').post(  auth , addCart )


module.exports = router