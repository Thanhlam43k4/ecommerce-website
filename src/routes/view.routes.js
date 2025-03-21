const express = require('express');
const router = express.Router();

const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("../config/db.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const axios = require('axios');
const categoryModel = require('../models/category.models.js'); // Điều chỉnh đường dẫn nếu cần
const userModel = require('../models/user.model.js')
const authMiddleware = require("../middlewares/authenticate");
const PORT = 5000



router.get('/', authMiddleware, async (req, res) => {
  const errorMessage = req.query.errorMessage || null;

  try {
    const response = await fetch(`http://localhost:${PORT}/api/products`);
    const products = await response.json();
    console.log(products);
    res.render("home", { products, user: req.user, errorMessage }); // user sẽ là null nếu chưa đăng nhập

  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.render("home", { products: [], user: req.user, errorMessage});
  }
})
router.get('/contact', authMiddleware, async (req, res) => {
  res.render('contact', { user: req.user })

})
router.get('/about', authMiddleware, async (req, res) => {
  res.render('about', { user: req.user })

})
router.get('/cart', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));
  }
  try {
    // Gọi API để lấy dữ liệu giỏ hàng của user

    const response = await axios.get(`http://localhost:${PORT}/api/cart/${req.user.userId}`);
    const cartItems = response.data;

    console.log(cartItems);

    res.render('cart', { user: req.user, cartItems });

  } catch (error) {
    console.error(error);
    res.render('cart', { user: req.user, cartItems: [], errorMessage: 'Failed to load cart items' });
  }
})
router.get('/category/:categoryId', authMiddleware, async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Gọi API để lấy danh sách sản phẩm theo danh mục
    const response = await fetch(`http://localhost:${PORT}/api/products/category/${categoryId}`);
    let products = await response.json();

    const response1 = await fetch(`http://localhost:${PORT}/api/products`);
    const featuredProducts = await response1.json();
    // Đảm bảo dữ liệu `products` là một mảng
    if (!Array.isArray(products)) {
      products = [];
    }

    // Lấy tên danh mục từ cơ sở dữ liệu
    let categoryName = await categoryModel.getCatNameById(categoryId);

    // Nếu không tìm thấy danh mục, đặt tên mặc định
    categoryName = categoryName || 'Danh mục không tồn tại';

    // Render trang với danh sách sản phẩm và tên danh mục
    res.render('products_by_categories', { products, categoryName, user: req.user, featuredProducts });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm theo danh mục:', error);

    // Render trang với danh mục rỗng nếu có lỗi
    res.render('products_by_categories', { products: [], categoryName: 'Danh mục không tồn tại', user: req.user });
  }
})
router.get('/cart/checkout', authMiddleware, async (req, res) => {


  res.render('checkout', { user: req.user })
})
router.get('/product/:productId', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;
    const response = await fetch(`http://localhost:${PORT}/api/products/${productId}`);
    const product = await response.json();

    if (response.status !== 200) {
      throw new Error(product.message || "Không tìm thấy sản phẩm");
    }

    res.render('product_info', { user: req.user, product });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error.message);
    res.render('product_info', { user: req.user, product: null, errorMessage: error.message });
  }
})
router.get('/store', authMiddleware, async (req, res) => {
  if (!req.user) {

    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));

  } else {
    const products = await userModel.getProductsBySellerId(req.user.userId)

    console.log(products);

    res.render('store', { products: products, user: req.user })
  }
})
router.get('/store/editproducts', authMiddleware, async (req, res) => {

  const products = await userModel.getProductsBySellerId(req.user.userId)

  res.render('editproducts', { user: req.user, products: products })
})
router.get('/whistlist',authMiddleware, async (req,res) =>{
  if (!req.user) {

    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));

  } else {
    const products = await userModel.getProductsBySellerId(req.user.userId)

    console.log(products);

    res.render('whistlist', { products: products, user: req.user })
  }
})

//test FE
router.get('/userprofile', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));
  } else {
    // Dữ liệu users
    const users = [
      { id: 1, username: 'admin', email: 'group11@gmail.com', password: 'admin', role: 'admin', created_at: '2025-03-05 12:44:00', updated_at: '2025-03-05 12:44:00', phone: null, address: null, city: null, postal_code: null },
      { id: 2, username: 'dodevice', email: 'dodevice@gmail.com', password: 'dodevice', role: 'user', created_at: '2025-03-05 12:44:00', updated_at: '2025-03-05 12:44:00', phone: null, address: null, city: null, postal_code: null },
    ];

    // Render template userprofile với dữ liệu users
    res.render('userprofile', { 
      users: users, // Truyền mảng users vào template
      user: req.user // Truyền thông tin user để dùng trong header
    });
  }
});

module.exports = router;