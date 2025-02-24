const Order = require('../models/order.models')

const orderController = {


  // GET /api/orders
  getOrders: async (req, res) => {
    try {
      const buyer_id = req.user.id;
      const orders = await Order.getOrdersByBuyer(buyer_id);
      return res.status(200).json(orders);
    } catch (err) {
      console.log("Error fetching orders by buyers:", err);
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


  // Post /api/orders - create Order

  createOrder: async (req, res) => {
    try {
      const buyer_id = req.user.id;
      const { total_price, full_name, phone, street, city, postal_code } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!total_price || !full_name || !phone || !street || !city || !postal_code) {
        return res.status(400).json({ message: "Missing required order fields." });
      }
      const orderId = await Order.createOrder({ buyer_id, total_price, full_name, phone, street, city, postal_code });
      return res.status(201).json({ message: "Order created successfully.", orderId });

    } catch (err) {
      console.error("Error Creating Order:", err);
      return res.status(500).json({ message: "Failed to create order!!!" })
    }
  },

  // Put /api/orders/:id

  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Order status is required!!!" })
      }
      const affectedRows = await Order.updateOrderStatus(orderId, status);
      if (affectedRows == 0) {
        return res.status(404).json({ message: "Order status updated successfully!!!" })
      }
      return res.status(200).json({message: "Order status updated successfully!!!"})
    }catch(error){
      console.log("Error updateing order status:", error);
      return res.status(500).json({message : "Failed to update order status!!!"})
    }
  },


}


module.exports = orderController;