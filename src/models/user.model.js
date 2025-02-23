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

  findByEmail: async (email) =>{
    try{
      const rows =  db.query("SELECT * FROM users WHERE email = ?", [email]);
      return rows.length > 0 ? rows[0] :null;
    }catch (err){
      throw err;
    }
  },
};


module.exports = User;

