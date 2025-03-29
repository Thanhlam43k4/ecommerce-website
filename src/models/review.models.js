// ReviewModel.js (Node.js Model)
const db = require('../config/db');

const review = {
  // Lấy tất cả các đánh giá
  getAllReviews: async () => {
    const sql = "SELECT * FROM reviews";
    try {
      const [rows] = await db.promise().execute(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  // Lấy đánh giá theo Product ID
  getReviewByProductId: async (productId) => {
    const sql = "SELECT * FROM reviews WHERE product_id = ?";
    try {
      const [rows] = await db.promise().execute(sql, [productId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  // Lấy đánh giá theo ID
  getReviewById: async (id) => {
    const sql = "SELECT * FROM reviews WHERE id = ?";
    try {
      const [rows] = await db.promise().execute(sql, [id]);
      if (rows.length > 0) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Thêm đánh giá mới
  addReview: async (productId, buyerId, rating, comment) => {
    const sql = "INSERT INTO reviews (product_id, buyer_id, rating, comment) VALUES (?, ?, ?, ?)";
    try {
      const [result] = await db.promise().execute(sql, [productId, buyerId, rating, comment]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật đánh giá
  updateReview: async (id, rating, comment) => {
    const sql = "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?";
    try {
      const [result] = await db.promise().execute(sql, [rating, comment, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Xóa đánh giá
  deleteReview: async (id) => {
    const sql = "DELETE FROM reviews WHERE id = ?";
    try {
      const [result] = await db.promise().execute(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = review;
