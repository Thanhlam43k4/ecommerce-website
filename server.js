const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./src/config/db");
const path = require("path");
const cookieParser = require("cookie-parser");
const axios = require('axios');

//Import routes
const authRoutes = require('./src/routes/auth.routes.js');
const productRoutes = require('./src/routes/product.routes');
const orderRoutes = require("./src/routes/order.routes");
const userRoutes = require('./src/routes/user.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const reviewRoutes = require('./src/routes/review.routes.js');
const cartRoutes = require('./src/routes/cart.routes.js')
const categoryModel = require('./src/models/category.models.js'); // Điều chỉnh đường dẫn nếu cần
const userModel = require('./src/models/user.model.js')
const authMiddleware = require("./src/middlewares/authenticate.js");



const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true })); // Cho form data
app.use(express.json()); // Cho dữ liệu JSON
app.use(cors());
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "src/views"))
app.use(cookieParser()); // Quan trọng để đọc cookie từ req.cookies

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src/public")));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);




app.get("/", authMiddleware, async (req, res) => {
  try {
    const response = await fetch(`http://localhost:${PORT}/api/products`);
    const products = await response.json();
    const errorMessage = req.query.errorMessage || null;
    console.log(products);
    res.render("home", { products, user: req.user, errorMessage }); // user sẽ là null nếu chưa đăng nhập

  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.render("home", { products: [], user: req.user });
  }
});
app.get('/contact', authMiddleware, async (req, res) => {
  res.render('contact', { user: req.user })
})
app.get('/about', authMiddleware, async (req, res) => {
  res.render('about', { user: req.user })
})
app.get('/category/:categoryId', authMiddleware, async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Gọi API để lấy danh sách sản phẩm theo danh mục
    const response = await fetch(`http://localhost:${PORT}/api/products/category/${categoryId}`);
    let products = await response.json();

    // Đảm bảo dữ liệu `products` là một mảng
    if (!Array.isArray(products)) {
      products = [];
    }

    // Lấy tên danh mục từ cơ sở dữ liệu
    let categoryName = await categoryModel.getCatNameById(categoryId);

    // Nếu không tìm thấy danh mục, đặt tên mặc định
    categoryName = categoryName || 'Danh mục không tồn tại';

    // Render trang với danh sách sản phẩm và tên danh mục
    res.render('products_by_categories', { products, categoryName, user: req.user });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm theo danh mục:', error);

    // Render trang với danh mục rỗng nếu có lỗi
    res.render('products_by_categories', { products: [], categoryName: 'Danh mục không tồn tại', user: req.user });
  }
});
app.get('/cart', authMiddleware, async (req, res) => {

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
});

app.get('/cart/checkout', authMiddleware, async (req, res) => {

  res.render('checkout', { user: req.user })
})
app.get('/product/:productId', authMiddleware, async (req, res) => {
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
});

app.get('/store', authMiddleware, async (req, res) => {

  if (!req.user) {

    return res.redirect('/?errorMessage=' + encodeURIComponent('You need to log in first'));

  } else {
    const products = await userModel.getProductsBySellerId(req.user.userId)

    console.log(products);

    res.render('store', { products: products, user: req.user })
  }
})

app.get('/store/editproducts', authMiddleware, async (req, res) => {

  const products = await userModel.getProductsBySellerId(req.user.userId)

  res.render('editproducts', { user: req.user, products: products })
})



app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
})