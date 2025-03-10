const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./src/config/db");
const path = require("path");

//Import routes
const authRoutes = require('./src/routes/auth.routes.js');
const productRoutes = require('./src/routes/product.routes');
const cartRoutes = require('./src/routes/cart.routes');
const orderRoutes = require("./src/routes/order.routes");
const userRoutes = require('./src/routes/user.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const reviewRoutes = require('./src/routes/review.routes.js');




const PORT = process.env.PORT || 3000;
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.set("views",path.join(__dirname,"src/views"))

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "src/public")));


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/reviews",reviewRoutes);

app.get("/", async (req, res) => {
  try {
    // Gọi API để lấy danh sách sản phẩm
    const response = await fetch(`http://localhost:${PORT}/api/products`);
    const products = await response.json();

    // Render trang và truyền danh sách sản phẩm
    res.render("home", { products, user: req.user});
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.render("home", { products: [], user: req.user}); // Nếu lỗi thì truyền mảng rỗng
  }
});


app.get("/login", async(req,res) => {

  res.render("login", {user: req.user});

})


app.get("/signup", async(req,res) =>{
  res.render("signup");
})


app.listen(PORT, () =>{
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
})