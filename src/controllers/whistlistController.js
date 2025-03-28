const Wishlist = require("../models/whislist.model");

// Lấy danh sách wishlist theo userId
const getWishlistByUserId = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlistByUserId(req.user.id);
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Thêm sản phẩm vào wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    await Wishlist.addToWishlist(req.user.userId, productId);
    res.status(201).json({ msg: "Added to wishlist successfully!" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Xóa sản phẩm khỏi wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    await Wishlist.removeFromWishlist(req.user.userId, productId);
    res.status(200).json({ msg: "Removed from wishlist successfully!" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

module.exports = {
  getWishlistByUserId,
  addToWishlist,
  removeFromWishlist,
};