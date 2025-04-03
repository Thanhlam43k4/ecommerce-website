const express = require('express');
const router = express.Router();

require("dotenv").config();
const axios = require('axios');
const categoryModel = require('../models/category.models.js'); // Điều chỉnh đường dẫn nếu cần
const userModel = require('../models/user.model.js')
const authMiddleware = require("../middlewares/authenticate");
const Wishlist = require('../models/whislist.model.js');
const PORT = 5000
const reviewController = require("../controllers/reviewController.js")
const orderController = require("../controllers/orderController.js")
const productModel = require('../models/product.model.js')
const orderModel = require('../models/order.models.js')
const productController = require('../controllers/productController.js')
const jwt = require("jsonwebtoken"); // Thêm JWT
const bcrypt = require("bcryptjs"); 



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

    res.render('store', { products: products, user: req.user })
  }
})
router.get('/store/editproducts', authMiddleware, async (req, res) => {
  try {
    const products = await userModel.getProductsBySellerId(req.user.userId);
    res.render('editproducts', { user: req.user, products: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({error: error})
  }
});
// add product
router.post('/store/addproduct', authMiddleware, async (req, res) => {
  try {
    // Lấy dữ liệu từ form
    const { image_urls, name, price, stock, description, category_id } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !stock || !category_id) {
      throw new Error('Please fill in all required fields (Name, Price, Quantity, Category)');
    }

    // Tạo object productData
    const productData = {
      image_urls: image_urls || '',
      name,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      category_id: parseInt(category_id),
      seller_id: req.user.userId, // Lấy từ req.user (authMiddleware)
    };
    console.log(productData)
    // Lưu sản phẩm vào database
    const productId = await productModel.create(productData);

    // Lấy lại danh sách sản phẩm mới nhất
    const products = await userModel.getProductsBySellerId(req.user.userId);

    // Render lại trang editproducts với danh sách sản phẩm cập nhật
    res.render('editproducts', {
      user: req.user,
      products: products,
      successMessage: 'Product added successfully!'
    });
  } catch (error) {
    console.error('Error adding product:', error);

    // Nếu có lỗi, render lại trang với thông báo lỗi
    const products = await userModel.getProductsBySellerId(req.user.userId);
    res.render('editproducts', {
      user: req.user,
      products: products,
      errorMessage: error.message || 'Failed to add product. Please try again.'
    });
  }
});

// Route GET để render trang Settings
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    // Giả sử user đã có thông tin theme và language
    res.render('setting', {
      user: req.user,
      successMessage: null,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error rendering settings:', error);
    res.status(500).render('error', {
      message: 'Failed to load settings.',
      error: error
    });
  }
});

router.post('/settings/update-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra mật khẩu mới và xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      throw new Error('Mật khẩu mới và xác nhận không khớp');
    }

    // Lấy thông tin user từ database
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    const updated = await userModel.updatePassword(req.user.userId, hashedNewPassword);
    if (!updated) {
      throw new Error('Không thể cập nhật mật khẩu');
    }

    res.render('setting', {
      user: req.user,
      successMessage: 'Cập nhật mật khẩu thành công!',
      errorMessage: null
    });
  } catch (error) {
    res.render('setting', {
      user: req.user,
      successMessage: null,
      errorMessage: error.message || 'Không thể cập nhật mật khẩu'
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
      return res.render('search_result', {
        products: [],
        user: req.user,
        errorMessage: 'Không tìm thấy sản phẩm nào',
        searchQuery,
      });
    }

    if (products.length === 1) {
      return res.redirect(`/product/${products[0].id}`); // Sử dụng 'id' thay vì 'productId'
    }

    res.render('search_result', {
      products,
      user: req.user,
      searchQuery,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.render('search_result', {
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
    console.log(orders)
    // console.log(orders);
    res.render('order', { orders, user: req.user }); // Render trang order.ejs với data

  } catch (error) {
    console.error("Error rendering orders page:", error);
  }
});

//test FE
router.get('/admin', authMiddleware, async (req, res) => {
  // Kiểm tra xác thực
  if (!req.user) {
    return res.redirect('/?errorMessage=' + encodeURIComponent('Bạn cần đăng nhập trước'));
  }

  // Lấy các tham số query
  const type = req.query.type || 'users'; // Mặc định là users
  const searchPhone = req.query.phone || ''; // Tìm kiếm theo số điện thoại (cho users)
  const searchQuery = req.query.q || ''; // Tìm kiếm chung (cho products
  const buyer_id = req.query.buyer_id || ''; // Tìm kiếm theo buyer_id (cho orders)
  try {
    let data = [];
    let message = '';

    // Xử lý theo loại dữ liệu
    if (type === 'users') {
      if (searchPhone) {
        data = await userModel.searchByPhone(searchPhone);
        
      } else {
        data = await userModel.getAllUsers();
        
      }
    } else if (type === 'products') {
      if (searchQuery) {
        data = await productModel.searchByQuery(searchQuery); // Chỉ tìm theo tên
        message = `Tìm thấy ${data.length} sản phẩm với tên: ${searchQuery}`;
      } else {
        data = await productModel.getAllProducts();
  
      }
    } else if (type === 'orders') {
      if (buyer_id) {
        data = await orderModel.getOrdersByBuyer(buyer_id); 
      } else {
        data = await orderModel.getAll();
  
      }
    }

    // Render template với dữ liệu
    res.render('admin', {
      data: data,
      type: type,
      user: req.user,
      searchPhone: searchPhone,
      searchQuery: searchQuery,
      buyer_id: buyer_id,
      message: message
    });
  } catch (error) {
    console.error(`Lỗi khi tải danh sách ${type}:`, error);
    res.render('admin', {
      data: [],
      type: type,
      user: req.user,
      searchPhone: searchPhone,
      searchQuery: searchQuery,
      buyer_id: buyer_id,
      errorMessage: `Lỗi khi tải danh sách ${type}`
    });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findByEmail(req.user?.email);
    if (!user) {
      return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));
    }
    res.render('userprofile', { user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Server Error");
  }
});


router.get('/errorPage', async (req, res) => {
  res.render('errorpage')
})


module.exports = router;