// Xử lý hiển thị form thêm sản phẩm
document.getElementById('add-product-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Ngăn chuyển hướng mặc định
    const form = document.getElementById('add-product-form');
    const bsCollapse = new bootstrap.Collapse(form, { toggle: true });
});

// Xử lý chọn category cho form thêm sản phẩm
document.querySelectorAll('#add-product-form .category-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('#add-product-form .category-btn').forEach(btn => btn.classList.remove('btn-primary'));
        this.classList.add('btn-primary');
    });
});






document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this product?')) {
            console.log('Deleting product:', productId);
            // Gửi request xóa lên server
            alert('Product deleted');
            const productItem = document.querySelector(`.product-item[data-id="${productId}"]`);
            productItem.remove();
        }
    });
});