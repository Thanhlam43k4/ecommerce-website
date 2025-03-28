// Hàm hiển thị thông báo dạng Toast
function showToast(message, isSuccess) {
  const toast = document.getElementById('toast-message');
  toast.textContent = message;
  toast.className = isSuccess ? 'toast success' : 'toast error';
  toast.style.display = 'block';

  // Ẩn sau 2 giây
  setTimeout(() => {
      toast.style.display = 'none';
  }, 2000);
}

// Hàm xóa sản phẩm khỏi wishlist
async function removeWishlist(productId) {
  try {
      const response = await fetch('/api/whistlist/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (response.ok && data.msg) {
          showToast(data.msg, true); // Hiển thị thông báo thành công
          setTimeout(() => location.reload(), 2000); // Reload sau 2s
      } else {
          showToast(data.msg || 'Failed to remove from wishlist.', false);
      }
  } catch (err) {
      showToast('An error occurred. Please try again.', false);
      console.error(err);
  }
}

// Hàm thêm sản phẩm vào giỏ hàng
async function addToCart(productId) {
  try {
      const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (response.ok && data.msg) {
          showToast(data.msg, true); // Hiển thị thông báo thành công
          setTimeout(() => location.reload(), 2000); // Reload sau 2s
      } else {
          showToast(data.msg || 'Failed to add to cart.', false);
      }
  } catch (err) {
      showToast('An error occurred. Please try again.', false);
      console.error(err);
  }
}
