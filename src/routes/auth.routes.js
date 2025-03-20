const express = require('express');
const { register, login } = require("../controllers/authController");
const router = express.Router();
const User = require('../models/user.model')
const jwt = require("jsonwebtoken"); // Thêm JWT
const bcrypt = require("bcryptjs"); // Thêm bcrypt

require("dotenv").config();


// Route register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log(req.body);
    
    if (password !== confirmPassword) {
      return res.render("signup", { error: "Mật khẩu không khớp!" });
    }

    // Gọi controller register và nhận lại userId
    const user = await register(req, res, true);

    if (!user) return; // Nếu có lỗi, `register` đã tự xử lý response

    const SECRET_KEY = process.env.SECRET_KEY;

    // Tạo token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    // Lưu token vào cookie
    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 3600000 });

    // Chuyển hướng sau khi đăng ký thành công
    res.redirect("/");

  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.render("signup", { error: "Lỗi server! Vui lòng thử lại." });
  }
});

router.get("/register", (req, res) => {
  res.render("signup", { error: null, user: req.user});
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);




    console.log(password);
    if (!isMatch) return res.status(401).json({ message: "Mật khẩu không đúng" });

    // Tạo token JWT
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email, username: user.username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // Lưu JWT vào cookie
  
    res.redirect("/"); // Chuyển hướng về trang chủ

  } catch (error) {

    console.error("Lỗi đăng nhập:", error);

    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/login", async (req, res) => {

  res.render("login", { user: req.user });

})

router.get("/logout", async(req,res) =>{

  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" }); // Xóa cookie token
  
  res.redirect("/api/auth/login"); // Chuyển hướng về trang đăng nhập

})
module.exports = router;


