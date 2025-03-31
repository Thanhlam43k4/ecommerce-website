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
const Wishlist = require('../models/whislist.model.js');
const PORT = 5000
const reviewController = require("../controllers/reviewController.js")
const orderController = require("../controllers/orderController.js")

router.get('/', authMiddleware, async (req, res) => {
  const errorMessage = req.query.errorMessage || null;
  console.log(req.user)
  try {
    const response = await fetch(`http://localhost:${PORT}/api/products`);
    const products = await response.json();
    res.render("home", { products, user: req.user, errorMessage }); // user sẽ là null nếu chưa đăng nhập

  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.render("home", { products: [], user: req.user, errorMessage });
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

    // Lấy userId từ req.user
    const userId = req.user.userId; // Tùy theo cấu trúc của user

    // Gọi API để lấy dữ liệu giỏ hàng với userId trong header
    const response = await axios.get(`http://localhost:${PORT}/api/cart?userId=${userId}`);


    const cartItems = response.data.cartItems;
    req.session.cartItems = cartItems;
    res.render('cart', { user: req.user, cartItems });

  } catch (error) {
    console.error(error);
    res.render('cart', { user: req.user, cartItems: [], errorMessage: 'Failed to load cart items' });
  }
});
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
  if (!req.user) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));
  }

  // Lấy dữ liệu giỏ hàng từ session
  const cartItems = req.session.cartItems || [];

  if (cartItems.length === 0) {
    return res.render('checkout', {
      user: req.user,
      cartItems: [],
      errorMessage: 'Your cart is empty. Please add some items to your cart first.'
    });
  }

  // Truyền dữ liệu giỏ hàng vào view checkout
  res.render('checkout', { user: req.user, cartItems });
});

router.get('/product/:productId', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;

    // Gọi API lấy thông tin sản phẩm
    const response = await fetch(`http://localhost:${PORT}/api/products/${productId}`);
    const product = await response.json();

    if (response.status !== 200) {
      throw new Error(product.message || "Không tìm thấy sản phẩm");
    }

    // Lấy reviews từ hàm getReviewsByProductId
    const reviews = await reviewController.getReviewsByProduct(productId);

    // Render ra view với sản phẩm và reviews
    res.render('product_info', {
      user: req.user,
      product,
      reviews
    });

  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error.message);
    res.render('product_info', {
      user: req.user,
      product: null,
      reviews: null,
      errorMessage: error.message
    });
  }
});

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
  try {
    const products = await userModel.getProductsBySellerId(req.user.userId);
    res.render('editproducts', { user: req.user, products: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', {
      message: 'Failed to load products. Please try again later.',
      error: error
    });
  }
});
router.get('/whistlist', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));
  }

  try {
    const products = await Wishlist.getWishlistByUserId(req.user.userId);
    console.log(products);
    res.render('whistlist', { products: products, user: req.user });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).render('error', {
      message: 'Failed to load wishlist. Please try again later.',
      error: error
    });
  }
})

router.get('/search', authMiddleware, async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('Vui lòng nhập từ khóa tìm kiếm'));
  }

  try {
    const response = await fetch(`http://localhost:${PORT}/api/products/search?q=${encodeURIComponent(searchQuery)}`);
    const products = await response.json();

    if (!Array.isArray(products) || products.length === 0) {
      return res.render('whistlist', {
        products: [],
        user: req.user,
        errorMessage: 'Không tìm thấy sản phẩm nào',
        searchQuery,
      });
    }

    if (products.length === 1) {
      return res.redirect(`/product/${products[0].id}`); // Sử dụng 'id' thay vì 'productId'
    }

    res.render('whistlist', {
      products,
      user: req.user,
      searchQuery,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.render('whistlist', {
      products: [],
      user: req.user,
      errorMessage: 'Lỗi khi tìm kiếm sản phẩm',
      searchQuery,
    });
  }
});
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await orderController.getOrders(req, res); // Lấy danh sách đơn hàng

    res.render('order', { orders, user: req.user }); // Render trang order.ejs với data

  } catch (error) {

    console.error("Error rendering orders page:", error);
    
    res.status(500).send("Something went wrong");
  }
});
//test FE
router.get('/profile', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));
  } else {
    // Dữ liệu users
    // Render template userprofile với dữ liệu users
    res.render('userprofile', {
      user: req.user // Truyền thông tin user để dùng trong header
    });
  }
});
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, phone, address, city, postalCode } = req.body;

    if (!username && !phone && !address && !city && !postalCode) {
      return res.status(400).json({ msg: "No fields to update" });
    }

    const updatedUser = await User.updateUser(userId, {
      username,
      phone,
      address,
      city,
      postalCode,
    });

    if (updatedUser.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Profile updated successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server Error!!", error: error.message });
  }
});
module.exports = router;