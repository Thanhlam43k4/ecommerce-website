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

document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const form = document.getElementById(`edit-form-${productId}`);
        const bsCollapse = new bootstrap.Collapse(form, { toggle: true });
    });
});

// Xử lý chọn category
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('btn-primary', 'btn-danger'));
        this.classList.add('btn-primary');
    });
});

// Xử lý Save (giả lập)
document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const form = document.getElementById(`edit-form-${productId}`);
        const image = form.querySelector('.edit-image').value;
        const name = form.querySelector('.edit-name').value;
        const price = form.querySelector('.edit-price').value;
        const quantity = form.querySelector('.edit-quantity').value;
        const description = form.querySelector('.edit-description').value;
        const category = form.querySelector('.btn-primary')?.getAttribute('data-category');

        console.log('Saving:', { productId, image, name, price, quantity, description, category });
        
        alert('Product saved! (Simulated)');
        new bootstrap.Collapse(form, { toggle: true }); 
    });
});


