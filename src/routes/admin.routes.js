const express = require("express");
const adminController = require("../controllers/adminController");
const authenticate = require("../middlewares/authenticate");
const authorizeAdmin = require("../middlewares/authorizeAdmin"); // Middleware này kiểm tra user có quyền admin hay không

const router = express.Router();

// Lấy danh sách user (chỉ admin mới có quyền truy cập)
router.get("/user", authenticate, authorizeAdmin, adminController.getAllUsers);

// Xóa user theo id (chỉ admin mới có quyền truy cập)
router.delete("/users/:id", authenticate, authorizeAdmin, adminController.deleteUser);

module.exports = router;