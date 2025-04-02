// Xử lý hiển thị form thêm sản phẩm
document.getElementById('add-product-btn').addEventListener('click', function (e) {
    e.preventDefault(); // Ngăn chuyển hướng mặc định
    const form = document.getElementById('add-product-form');
    const bsCollapse = new bootstrap.Collapse(form, { toggle: true });
});

// Xử lý chọn category cho form thêm sản phẩm
document.querySelectorAll('#add-product-form .category-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('#add-product-form .category-btn').forEach(btn => btn.classList.remove('btn-primary'));
        this.classList.add('btn-primary');
    });
});
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




document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-id');
        const form = document.getElementById(`edit-form-${productId}`);
        const bsCollapse = new bootstrap.Collapse(form, { toggle: true });
    });
});

// Xử lý chọn category
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('btn-primary', 'btn-danger'));
        this.classList.add('btn-primary');
    });
});



async function RemoveProduct(productId) {
    try {   
        // Gửi yêu cầu xóa sản phẩm theo productId
        
        const response = await fetch(`/api/products/${productId}`, {
            method: 'post', // Sử dụng phương thức DELETE
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        console.log(data);

        if (response.ok && data.success) {
            // Nếu xóa thành công, hiển thị thông báo thành công
            showToast(data.message || 'Product removed successfully!', true);

            // Reload trang sau 2s
            setTimeout(() => location.reload(), 2000);
        } else {
            // Nếu có lỗi, hiển thị thông báo thất bại
            showToast(data.message || 'Failed to remove product.', true);

            setTimeout(() => location.reload(), 2000);
        }
    } catch (err) {
        // Xử lý lỗi nếu có
        showToast('An error occurred. Please try again:',false);
        console.error(err);
    }
}

async function updateProduct(productId) {
    // Giả sử bạn lấy thông tin sản phẩm từ form hoặc input trong UI
    const updatedProduct = {
        name: document.getElementById('edit-name-' + productId).value,            // Lấy tên sản phẩm từ input có id="edit-name-{productId}"
        description: document.getElementById('edit-description-' + productId).value, // Lấy mô tả sản phẩm
        price: document.getElementById('edit-price-' + productId).value,             // Lấy giá sản phẩm
        image_urls: document.getElementById('edit-image-' + productId).value         // Lấy URL của ảnh (chỉ 1 ảnh)
      };

    try {
        // Gửi yêu cầu PUT để cập nhật sản phẩm theo productId
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',  // Sử dụng phương thức PUT để cập nhật
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),  // Gửi thông tin sản phẩm cập nhật
        });

        const data = await response.json(); // Xử lý dữ liệu trả về từ server
        console.log(data);

        if (response.ok && data.success) {
            // Nếu cập nhật thành công, hiển thị thông báo thành công
            showToast(data.message || 'Product updated successfully!', true);
            setTimeout(() => location.reload(), 2000);  // Reload trang sau 2s
        } else {
            // Nếu có lỗi, hiển thị thông báo thất bại
            showToast(data.message || 'Failed to update product.', true);
            setTimeout(() => location.reload(), 2000);  // Reload trang sau 2s

        }
    } catch (err) {
        // Xử lý lỗi nếu có
        showToast('An error occurred. Please try again:', false);
        console.error(err);
    }
}


setTimeout(() => {
    let errorToast = document.getElementById("errorToast");
    if (errorToast) {
        errorToast.classList.remove("show");  // Bootstrap sẽ ẩn alert
        errorToast.classList.add("fade"); // Thêm hiệu ứng mờ dần
        setTimeout(() => errorToast.remove(), 500); // Xóa khỏi DOM sau 0.5s
    }
}, 1000); // Tự động tắt sau 1 giây