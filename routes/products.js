const express = require('express')
const router = express.Router();

const { getAllProducts , getProduct , getCategories , sortProduct , search } = require('../controllers/product')

router.route('/category').get(getCategories)
router.route('/').get(getAllProducts)
router.route('/:id').get(getProduct)

router.route('/sort/pr').get(sortProduct)
router.route('/search/we').get(search)







module.exports = router
