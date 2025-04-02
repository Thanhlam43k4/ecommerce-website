const Order = require('../models/order.models')
const Product = require('../models/product.model')
const normalizeCartItems = require('../middlewares/normalizeCart')
const orderController = {


  // GET /api/orders
  getOrders: async (req, res) => {
    try {
      const buyer_id = req.user.userId;
      const orders = await Order.getOrdersByBuyer(buyer_id);

      if (!orders || orders.length === 0) {
        return res.status(204).send(); // Không trả về nội dung nếu không có đơn hàng nào
      }

      return orders;
    } catch (err) {
      console.error("Error fetching orders by buyers:", err);
      return res.status(500).json({ message: "Unable to fetch orders. Please try again later." });
    }
  },
  // GET /api/orders/:id - Get detail of orders

  getOrderById: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found!!!" });
      }
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order details: ", error);
      return res.status(500).json({ message: "Unable to fetch order details" });
    }

  },
  // POST /api/orders - Create a new order
  createOrder: async (req, res) => {
    try {
      const buyer_id = req.user.userId;
      const { subtotal, firstName, phone, streetAddress, city, postalCode, cartItems } = req.body;

      // Check if cartItems are provided and not empty
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "No items in the cart." });
      }

      // Create the order
      // console.log(req.body);
      const orderId = await Order.addOrder(buyer_id, subtotal, firstName, phone, streetAddress, city, postalCode);

      // Add items to the order
      const normalizedCartItems = normalizeCartItems(cartItems);


      for (let item of normalizedCartItems) {
        const { productId, quantity } = item;
        // Ensure the product exists before adding to the order
        const product = await Product.getById(productId);
        if (!product) {
          return res.status(400).json({ message: `Product with ID ${productId} does not exist.` });
        }

        // Add the item to order_items table
        await Order.addOrderItems(orderId, productId, quantity);
      }

      return res.status(201).json({ message: "Order created successfully", orderId });
    } catch (err) {

      console.error("Error creating order: ", err);

      return res.status(500).json({ message: "Unable to create order. Please try again later." });
    }
  },

  //GET /api/orders/items/:id - get all order items from orderId
  getOrderItemsById: async(req, res) => {
    try {
      const orderId = req.params.orderId;
      const orderItems = await Order.getOrderItemsByOrderId(orderId);
      if (!orderItems) {
        return res.status(404).json({message: "Order items from orderId not found."});
      }
      return res.status(200).json(orderItems);
    } catch(err) {
      console.error("Error fetching all order items", err);
      return res.status(500).json({message: "Unable to fetch all order items. Please try again later."});
    }
  },

  //GET /api/orders/all - get all orders
  getAllOrders: async(req, res) => {
    try {
      const orders = await Order.getAll();
      return res.status(200).json(orders);
    } catch(err) {
      console.error("Error fetching all orders: ", err);
      return res.status(500).json({message: "Unable to fetch all orders. Please try again later."});
    }
  }
}


module.exports = orderController;