const db = require('../config/db')


const Order = {

  getOrderbyBuyer: async(buyer_id) =>{
    const sql = "SELECT * FROM orders where buyer_id = ? ORDER BY created_at DESC";
    try{
      const [orders]  = await db.promise().execute(sql,[buyer_id]);
      return orders;

    }catch (err){
      throw err;
    }
  },
  
  // get Detail order by Id
  getOrderById: async(id) =>{
    const sql = "SELECT * FROM orders WHERE id = ?";
    try{
      const [rows] = await db.promise().execute(sql,[id]);
      return rows.length ? rows[0] : null;
    } catch(err){
      throw err;
    }
  }
}