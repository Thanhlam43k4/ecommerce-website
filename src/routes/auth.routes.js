const express = require('express');
const { register, login } = require("../controllers/authController");
const router = express.Router();
const User = require('../models/user.model')
const jwt = require("jsonwebtoken"); // Thêm JWT
const bcrypt = require("bcryptjs"); // Thêm bcrypt
const passport = require('passport');

require("dotenv").config();


// Route register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log(req.body);
    
    if (password !== confirmPassword) {
      return res.render("signup", { errorMessage: "Mật khẩu không khớp!",user:null,  });
    }

    // ✅ Gọi controller register và nhận lại user hoặc errorMessage
    const { user, errorMessage } = await register(req, res);

    // ✅ Nếu có lỗi (ví dụ: email tồn tại)
    if (errorMessage) {
      return res.render("register", { error: errorMessage, user : null }); // Chuyển về trang login
    }

    const SECRET_KEY = process.env.SECRET_KEY;

    // ✅ Tạo token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    // ✅ Lưu token vào cookie
    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 3600000 });

    // ✅ Chuyển hướng sau khi đăng ký thành công
    res.redirect("/");

  } catch (error) {
    console.error("🔥 Lỗi khi đăng ký:", error);
    res.render("signup", { error: "Lỗi server! Vui lòng thử lại." });
  }
});

router.get("/register", (req, res) => {
  res.render("signup", { errorMessage: null, user: req.user});
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
// Route đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'],session : false }));

// Callback từ Google
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  try {
    // Lấy token từ Passport
    const token = req.user;
    // Lưu JWT vào cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    res.redirect("/"); // Chuyển hướng về trang chủ

  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);

    res.redirect("/login");
  }
});

module.exports = router;


