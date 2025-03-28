function addWishlist(productId) {
  fetch('/wishlist/add', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId: productId }) // Chỉ cần gửi productId
  })
      .then(response => response.json())
      .then(data => {
          if (data.msg) {
              alert(data.msg);
          } else {
              alert("Failed to add to wishlist.");
          }
      })
      .catch(err => console.error('Error:', err));
}


function viewProduct(productId) {
  window.location.href = `/product/${productId}`;
}
document.addEventListener("DOMContentLoaded", function () {
  let slides = document.querySelector(".slides");
  let index = 0;
  const totalSlides = document.querySelectorAll(".slides img").length;

  setInterval(() => {
      index = (index + 1) % totalSlides;
      slides.style.transform = `translateX(-${index * 100}vw)`;
  }, 3000); // Chuyển slide sau mỗi 3 giây
});
setTimeout(() => {
  let errorToast = document.getElementById("errorToast");
  if (errorToast) {
      errorToast.classList.remove("show");  // Bootstrap sẽ ẩn alert
      errorToast.classList.add("fade"); // Thêm hiệu ứng mờ dần
      setTimeout(() => errorToast.remove(), 500); // Xóa khỏi DOM sau 0.5s
  }
}, 1000); // Tự động tắt sau 1 giây