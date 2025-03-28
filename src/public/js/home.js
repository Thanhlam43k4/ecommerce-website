// Hàm hiển thị thông báo Toast
function showToast(message, isSuccess = true) {
    const toastElement = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const bsToast = new bootstrap.Toast(toastElement);

    // Đổi màu dựa trên trạng thái thành công/thất bại
    if (isSuccess) {
        toastElement.classList.remove('text-bg-danger');
        toastElement.classList.add('text-bg-success');
    } else {
        toastElement.classList.remove('text-bg-success');
        toastElement.classList.add('text-bg-danger');
    }

    // Cập nhật thông báo
    toastMessage.textContent = message;
    bsToast.show(); // Hiển thị toast
}




async function addWhistlist(productId) {
    try {
        const response = await fetch('/api/whistlist/add', { // Chú ý sửa đúng URL nếu cần
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }) // Truyền productId gọn
        });

        const data = await response.json();

        if (response.ok && data.msg) { // Kiểm tra OK và có message
            showToast(data.msg, true);
            setTimeout(() => location.reload(), 2000); // Reload sau 2s
        } else {
            showToast(data.msg || 'Failed to add to wishlist.', false);
        }
    } catch (err) { // Bắt lỗi chung cho các vấn đề khác
        showToast('An error occurred. Please try again.', false);
        console.error(err);
    }
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