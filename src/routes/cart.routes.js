const express = require('express');
const router = express.Router();
const cart = require('../models/cart.models.js');

router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await cart.getCartByUserId(req.params.userId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
