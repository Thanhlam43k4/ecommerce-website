const express = require('express')
const productController = require('../controllers/productController')
const authenticate = require('../middlewares/authenticate')
const authorizeSeller = require('../middlewares/authorizeSeller')


const router = express.Router();


router.get('/search', productController.searchProducts);
router.get('/',productController.getAllProducts);

router.get('/categories', productController.getAllCategories);

router.get('/:id',productController.getProductById);

router.post('/',authenticate,productController.createProduct);

router.put('/:id',authenticate,productController.updateProduct);

router.delete('/:id',authenticate,productController.deleteProduct);

router.get('/category/:categoryId', productController.getProductsByCategory);



module.exports = router;