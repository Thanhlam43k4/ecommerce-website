const db = require('../config/db')


const Order = {


  // Thêm đơn hàng mới
  addOrder: async (buyer_id, total_price, full_name, phone, street, city, postal_code) => {
    console.log(buyer_id, total_price, full_name, phone, street, city, postal_code)
    const sql = `
      INSERT INTO orders (buyer_id, total_price, full_name, phone, street, city, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)`; // Trạng thái mặc định là 'pending'

    try {
      const [result] = await db.promise().execute(sql, [buyer_id, total_price, full_name, phone, street, city, postal_code]);
      return result.insertId; // Trả về id của đơn hàng vừa được tạo
    } catch (err) {
      throw err;
    }
  },

  // Thêm sản phẩm vào đơn hàng
  addOrderItems: async (order_id, product_id, quantity) => {
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES (?, ?, ?)`;

    try {
      await db.promise().execute(sql, [order_id, product_id, quantity]);
    } catch (err) {
      throw err;
    }
  },
  getOrdersByBuyer: async (buyer_id) => {
    try {
      const [rows] = await db.promise().query("SELECT * FROM orders WHERE buyer_id = ?", [buyer_id]);

      return rows.length > 0 ? rows : [];  // ✅ Trả về danh sách hoặc mảng rỗng nếu không có đơn hàng
    } catch (err) {
      console.error("Database error:", err);
      return null;  // ✅ Trả về null nếu có lỗi
    }
  },
  // get Detail order by Id
  getOrderById: async (id) => {
    const sql = "SELECT * FROM orders WHERE id = ?";
    try {
      const [rows] = await db.promise().execute(sql, [id]);
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  // get all order_items 
  getOrderItemsByOrderId: async (orderId) => {
    const sql = `
      SELECT 
        oi.product_id,
        oi.quantity,
        p.name,
        p.price,
        p.image_urls
      FROM order_items AS oi
      JOIN products AS p on p.id = oi.product_id
      WHERE oi.order_id = ?
    `;
    try {
      const [rows] = await db.promise().execute(sql, [orderId]);
      return rows.length > 0 ? rows : [];
    } catch (err) {
      throw err;
    }
  },

  // get all orders (for admin)
  getAll: async() => {
    const sql = "SELECT * FROM orders";
    try {
      const [rows] = await db.promise().query(sql);
      return rows.length > 0 ? rows : [];
    } catch (err) {
      throw err;
    }
  },
}
module.exports = Order;
