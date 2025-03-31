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
      const [rows] = await db.execute("SELECT * FROM orders WHERE buyer_id = ?", [buyer_id]);

      console.log("Fetched Orders:", rows);  // ✅ Kiểm tra kết quả truy vấn

      return Array.isArray(rows) ? rows : [];  // ✅ Đảm bảo trả về một mảng
    } catch (err) {
      console.error("Database error:", err);
      return [];
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
  }
}
module.exports = Order;
