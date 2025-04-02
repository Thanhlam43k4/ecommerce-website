document.getElementById('edit-products-btn').addEventListener('click', function () {
  window.location.href = 'store/editproducts';
});
// Nếu có nhiều icon
document.querySelectorAll('.icon-circle').forEach(icon => {
  icon.addEventListener('click', function () {
    this.classList.toggle('clicked');
  });
});
function viewProduct(productId) {
  window.location.href = `/product/${productId}`;
}
