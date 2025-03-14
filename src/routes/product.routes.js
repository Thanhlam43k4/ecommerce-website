const express = require('express')
const productController = require('../controllers/productController')
const authenticate = require('../middlewares/authenticate')
const authorizeSeller = require('../middlewares/authorizeSeller')


const router = express.Router();



router.get('/',productController.getAllProducts);

router.get('/:id',productController.getProductById);

router.post('/',authenticate,authorizeSeller,productController.createProduct);

router.put('/:id',authenticate,authorizeSeller,productController.updateProduct);

router.delete('/:id',authenticate,authorizeSeller,productController.deleteProduct);

router.get('/category/:categoryId', productController.getProductsByCategory);


module.exports = router;