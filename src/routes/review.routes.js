const express = require("express");
const reviewController = require("../controllers/reviewController");
const authenticate = require("../middlewares/authenticate"); // Middleware xác thực người dùng

const router = express.Router();

// Route thêm đánh giá (Buyer cần đăng nhập)
router.post("/", authenticate, reviewController.createReview);

// Route lấy đánh giá của sản phẩm theo productId
router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;