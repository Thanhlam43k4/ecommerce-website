const Review = require('../models/review.models')


const reviewController = {
  // Post /api/reviews - Add new review (Buyer)

  createReview: async (req, res) => {
    try {
      const buyer_id = req.user.id;

      const { product_id, rating, comment } = req.body;

      if (!product_id || rating == undefined) {
        return res.status(400).json({ message: "Missing required fields: product_id and rating!!" });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" })
      }

      const result = await Review.create({ product_id, buyer_id, rating, comment })

      return res.status(201).json({ message: "Review added successfully!!!", result })

    } catch (err) {

      console.log("Error creating review: ", err);

      return res.status(500).json({ message: "Failed to create review!!" })
    }
  },

  // GET /api/reviews/:productId - get Review 

  getReviewsByProduct: async (req, res) => {
    try {
      const reviews = await Review.getReviewByProductId(productId);
      console.log(reviews)
      return reviews;
    } catch (error) {
      console.error("Error fetching reviews: ", error);
      return res.status(500).json({ message: "Failed to fetch reviews!!" });
    }
  },

}


module.exports = reviewController;
