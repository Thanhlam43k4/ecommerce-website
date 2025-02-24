const express = require('express')
const orderController = require('../controllers/orderController')
const authenticate = require("../middlewares/authenticate");
const authorizeAdmin = require("../middlewares/authorizeAdmin");



const router = express.Router();


router.get('/',authenticate,orderController.getOrders);

router.get('/:id',authenticate,orderController.getOrderById);

router.post('/',authenticate,orderController.createOrder);

router.put('/:id',authenticate,authorizeAdmin,orderController.updateOrderStatus);


module.exports = router;
