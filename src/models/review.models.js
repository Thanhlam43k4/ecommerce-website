const db = require('../config/db');
const { getAllReviews } = require('../controllers/reviewController');

const Review = {

  // Add new review 
  create: async (reviewData) => {
    const { product_id, buyer_id, rating, comment } = reviewData;
    const sql = "INSERT INTO reviews (product_id, buyer_id, rating, comment) VALUES (?, ?, ?, ?)";
    try {
      const [result] = await db.promise().execute(sql, [product_id, buyer_id, rating, comment]);

      return result.insertId || "Review created successfully!!!!";
    } catch (err) {
      throw err;
    }
  },

  //Get all reviews
  getAll: async () => {
    const sql = `
      SELECT * 
      FROM reviews
      ORDER BY product_id, created_at DESC
    `;
    try {
      const [reviews] = await db.promise().execute(sql);
      return reviews
    } catch(err) {
      throw err;
    }
  },


  // Get review by productId
  getByProductId: async (productId) => {
    const sql = `
    SELECT product_id, buyer_id, rating, comment, created_at 
    FROM reviews 
    WHERE product_id = ? 
    ORDER BY created_at DESC
  `;
    try {
      const [rows] = await db.promise().execute(sql, productId);
      return rows;
    } catch (err) {
      throw err;
    }
  },


}

module.exports = Review;