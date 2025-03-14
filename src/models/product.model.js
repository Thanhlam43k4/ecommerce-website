const db = require("../config/db")

const Product = {
  //get all product
  getAll: async() =>{
    const sql = "SELECT * FROM products";
    try{
      const [products] = await db.promise().query(sql);
      return products;
    }catch(err){
      throw err;
    }
  },
  getById: async(id) =>{
    const sql = "SELECT * FROM products WHERE id = ?";
    try{
      const [rows] = await db.promise().execute(sql,[id])
      return rows.length ? rows[0] : null;
    } catch (err){

      console.log('Error: ',err);
      throw err;
    }
  },
  create: async(productData) =>{
    const {name, description,price,stock,image_urls,category_id,seller_id} = productData;
    const sql = `INSERT INTO products (id, name, description, price, stock, image_urls, category_id, seller_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    try{
      await db.promise().execute(sql, [id, name, description, price, stock, image_urls, category_id, seller_id]);
      return id;
    }catch(error){
      throw error;
    }
  },
   // Cập nhật sản phẩm (Seller)
  update: async (id, productData) => {
    const { name, description, price, stock, image_urls, category_id } = productData;
    const sql = `UPDATE products 
                 SET name = ?, description = ?, price = ?, stock = ?, image_urls = ?, category_id = ? 
                 WHERE id = ?`;
    try {
      const [result] = await db.promise().execute(sql, [name, description, price, stock, image_urls, category_id, id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
  // Xóa sản phẩm (Seller)
  delete: async (id) => {
    const sql = "DELETE FROM products WHERE id = ?";
    try {
      const [result] = await db.promise().execute(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
  getByCategory: async (categoryId) => {
    const sql = "SELECT * FROM products WHERE category_id = ?";
    try {
      const [products] = await db.promise().execute(sql, [categoryId]);
      return products;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  },
}

module.exports = Product;
