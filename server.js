const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./src/config/db");

//Import routes
const authRoutes = require('./src/routes/auth.routes.js');
const productRoutes = require('./src/routes/product.routes');
const cartRoutes = require('./src/routes/cart.routes');
const orderRoutes = require("./src/routes/order.routes");




const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("/api/auth",authRoutes);

app.get("/",(req,res) =>{
  res.send("Uet Store API is running....")
})



app.listen(PORT, () =>{
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
})