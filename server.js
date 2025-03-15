const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./src/config/db");
const path = require("path");
const cookieParser = require("cookie-parser");
//Import routes
const authRoutes = require('./src/routes/auth.routes.js');
const productRoutes = require('./src/routes/product.routes');
const cartRoutes = require('./src/routes/cart.routes');
const orderRoutes = require("./src/routes/order.routes");
const userRoutes = require('./src/routes/user.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const reviewRoutes = require('./src/routes/review.routes.js');
const categoryModel = require('./src/models/category.models.js'); // Điều chỉnh đường dẫn nếu cần
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




app.get("/", authMiddleware, async (req, res) => {
  try {
    const response = await fetch(`http://localhost:${PORT}/api/products`);
    const products = await response.json();
    console.log(products);
    res.render("home", { products, user: req.user, errorMessage: null}); // user sẽ là null nếu chưa đăng nhập

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

app.get('/category/:categoryId',authMiddleware, async (req, res) => {
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

app.get('/cart',authMiddleware,async (req,res) =>{

  if(!req.user){
    res.render('/home',{errorMessage : 'Please login before going to your cart!!!'})
  }
  res.render('cart', {user: req.user, cartItems :null})



})
app.get('/cart/checkout',authMiddleware,async(req,res) =>{
  res.render('checkout',{user :req.user})
})
app.get('/product/:productId',authMiddleware,async(req,res) =>{

  res.render('product_info', {user : req.user, product : null})
  
})

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
})