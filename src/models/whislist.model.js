const db = require("../config/db");

const Wishlist = {
  getWishlistByUserId: async (userId) => {
    try {
      const [rows] = await db.promise().execute(
        `SELECT p.* FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  addToWishlist: async (userId, productId) => {
    try {
      const sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
      const [result] = await db.promise().execute(sql, [userId, productId]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  removeFromWishlist: async (userId, productId) => {
    try {
      const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
      const [result] = await db.promise().execute(sql, [userId, productId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Wishlist;
