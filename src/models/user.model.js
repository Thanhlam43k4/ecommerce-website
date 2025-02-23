const db = require("../config/db");


const User = {
  create: async (userData) => {
    const { name, email, password, role } = userData;
    const sql = "INSERT INTO users(username, email, password, role) VALUES (?, ?, ?, ?)";

    try {
      // Sử dụng `await` để đợi kết quả từ MySQL
      const [result] = await db.promise().execute(sql, [name, email, password, role]);

      console.log(`Add user with email ${email} successfully!!`);
      return result.insertId;
    } catch (err) {
      console.error("Error inserting user:", err);
      throw err;
    }
  },

  findByEmail: async (email) => {
    try {
      const [rows] = await db.promise().execute("SELECT * FROM users WHERE email = ?", [email]);
      console.log("Finding user....", rows, email);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await db.promise().execute("SELECT * FROM users WHERE id = ?", [id]);
      console.log("Finding user....", rows, id);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },
  // Lấy danh sách tất cả user
  getAllUsers: async () => {
    try {
      const [users] = await db.promise().query("SELECT id, username, email, role, created_at FROM users");
      return users;
    } catch (error) {
      throw error;
    }
  },
  // Xóa user theo id
  deleteUserById: async (id) => {
    try {
      const [result] = await db.promise().execute("DELETE FROM users WHERE id = ?", [id]);
      return result; // result.affectedRows sẽ cho biết có bao nhiêu dòng bị xóa
    } catch (error) {
      throw error;
    }
  },

};


module.exports = User;

