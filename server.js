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

app.get("/",(req,res) =>{
  res.render("account-home");
})

app.listen(PORT, () =>{
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
})