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

  // GET/api/reviews/ - get all reviews (for chatbot)
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.getAll();
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  // GET /api/reviews/:productId - get Review 

  getReviewsByProduct: async (req, res) => {
    try {

      const productId = req.params.productId;

      const reviews = await Review.getByProductId(productId);

      return res.status(200).json({ reviews });
    }catch(error) {
      console.error("Error Fetching reviews: ",error);
      return res.status(500).json({message : "Failed to fetch reviews."});
    }
  },

}


module.exports = reviewController;
