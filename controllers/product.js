const StatusCodes = require('http-status-codes')
const fetch = require('node-fetch');


const getProduct = async (req ,res ) => {
    try {
        const id = req.params.id;
        const product = await fetch(`https://dummyjson.com/products/${id}`)

        if(!product.ok){
            throw new error ("Could not get product")
        }

        const data = await product.json();

        res.status(StatusCodes.OK).json(data)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error : error.message
        })
    }
}


const getAllProducts = async (req , res) => {
    
    try {
        
        const products = await fetch('https://dummyjson.com/products')

        if(!products.ok){
            throw new Error("Could not get products")
        }

        const data = await products.json();

        res.status(StatusCodes.OK).json(data)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error : error.message
        })
    }

}

const getCategories = async ( req , res ) => {
    try {
        const catgeory = await fetch('https://dummyjson.com/products/categories');
        if (!catgeory.ok) {
            throw new error("Could not get category")
        }
        const data = await catgeory.json();

        res.status(StatusCodes.OK).json(data)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error : error.message
        })
    }
}

const sortProduct = async ( req , res ) => {

    const sortCategory = req.query.category;
    const sortPrice = req.query.price;
    const apiData = await fetch('https://dummyjson.com/products');

    if (!apiData.ok) {
        throw new error ("The api we are using is currently useless")
    }

    const data = await apiData.json();
    const products = data.products

    let filteredproducts = products
    
    if( sortCategory){
        filteredproducts = filteredproducts.filter((product) => product.category === sortCategory);
      
    } 
    if (sortPrice){
        if(sortPrice === 'asc'){
           filteredproducts = filteredproducts.sort((product1 , product2) => product1.price - product2.price)
          
        } else if (sortPrice === 'desc'){
            filteredproducts = filteredproducts.sort((product1 , product2) => product2.price - product1.price)
         
        }
    }
    res.status(StatusCodes.OK).json(filteredproducts)
    
}

const search = async (req , res ) => {
    const apiData = await fetch('https://dummyjson.com/products');
    const search = req.query.search.toLowerCase();

    if (!apiData.ok) {
        throw new error ("The api we are using is currently useless")
    }

    const data = await apiData.json();
    const products = data.products

    const searchedProduct = products.filter((product) => product.title.toLowerCase().includes(search))

    if(searchedProduct.length > 0){
        res.status(StatusCodes.OK).json(searchedProduct)
    } else {
        res.status(StatusCodes.BAD_REQUEST).json("No product found")
    }

    
}

module.exports = {
    getAllProducts,
    getProduct,
    getCategories,
    sortProduct ,
    search
}