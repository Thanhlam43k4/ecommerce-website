const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authenticate");
const wishlistController = require("../controllers/whistlistController");

// Lấy danh sách wishlist theo userId
router.get('/', authMiddleware, wishlistController.getWishlistByUserId);

// Thêm sản phẩm vào wishlist
router.post('/add', authMiddleware, wishlistController.addToWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete('/remove', authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
