document.addEventListener("DOMContentLoaded", function () {
  const cancelButtons = document.querySelectorAll(".cancel-order");

  cancelButtons.forEach(button => {
    button.addEventListener("click", function () {
      const orderId = this.getAttribute("data-id");
      if (confirm(`Bạn có chắc muốn hủy đơn hàng #${orderId}?`)) {
        fetch(`/api/orders/cancel/${orderId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert("Đơn hàng đã được hủy.");
              location.reload();
            } else {
              alert("Hủy đơn hàng thất bại. Vui lòng thử lại.");
            }
          })
          .catch(error => console.error("Error:", error));
      }
    });
  });
});