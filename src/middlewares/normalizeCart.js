function normalizeCartItems(cartItems) {
  // Giả sử cartItems là mảng dữ liệu gốc có dạng như bạn đã cung cấp
  return cartItems[0].name.map((name, index) => ({
    name: name,
    quantity: cartItems[0].quantity[index],
    price: cartItems[0].price[index],
    productId: cartItems[0].productId[index]
  }));
}


module.exports = normalizeCartItems;
