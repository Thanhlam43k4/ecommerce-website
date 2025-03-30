 // Cập nhật subtotal cho từng sản phẩm
 function updateSubtotal(selectElement, price, itemId) {
  let quantity = parseInt(selectElement.value);
  let subtotalCell = selectElement.closest("tr").querySelector(".subtotal");
  let newSubtotal = quantity * price;
  subtotalCell.innerText = `$${newSubtotal.toFixed(2)}`;
  updateTotal();

  // Cập nhật số lượng lên server
  fetch(`/cart/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity })
  })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(itemId) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`/cart/remove/${itemId}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  document.getElementById(`item-${itemId}`).remove();
                  updateTotal();
              } else {
                  alert("❌ Xóa sản phẩm thất bại!");
              }
          })
          .catch(err => console.error("Lỗi:", err));
  }
}

// Cập nhật tổng tiền khi thay đổi số lượng
function updateTotal() {
  let total = 0;
  document.querySelectorAll(".subtotal").forEach(cell => {
      total += parseFloat(cell.innerText.replace("$", "")) || 0;
  });
  document.getElementById("total").innerText = `$${total.toFixed(2)}`;
  document.getElementById("grand-total").innerText = `$${total.toFixed(2)}`;
}