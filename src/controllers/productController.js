const Product = require("../models/product.model")



const productController = {
  // Get /api/products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAll();
      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  // Get /api/products/:id

  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }
      res.status(200).json(product)
    } catch (err) {
      res.status(500)
    }
  },

  // Post /api/products - Add product (seller)

  createProduct: async (req, res) => {
    try {
      const productData = req.body;
      productData.seller_id = req.user.id;
      const productId = await Product.create(productData);
      res.status(201).json({ message: "Product created Successfully!!!", productId });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // Put /api/products/:id - Update product (seller)
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const productData = req.body;
      const affectedRows = await Product.update(id, productData);
      if (affectedRows == 0) {

        return res.status(404).json({ message: "Product not found or update failed!!!" });
      }
      res.status(200).json({ message: "Product updated successfully!!!" });

    } catch (err) {

      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // Delete /api/products/:id - Delete products (seller)

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const affectedRows = await Product.delete(id);
      if (affectedRows == 0) {
        return res.status(404).json({ message: "Product not found!!" });
      }
      res.status(200).json({ message: "Product deleted successfully!!" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // Get products by category ID
  getProductsByCategory: async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      const products = await Product.getByCategory(categoryId);
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this category." });
      }
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // Get /api/products/categories - Use for chatbot
  getAllCategories: async (req, res) => {
    try {
        const categories = await Product.getCategories();        
        const formattedCategories = categories.reduce((obj, category) => {
            obj[category.id] = category.name;
            return obj;
        }, {});

        res.status(200).json(formattedCategories);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}

module.exports = productController;

