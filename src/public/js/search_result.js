// Xử lý sự kiện thêm vào wishlist
document.querySelectorAll('.add-to-wishlist').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const icon = this.querySelector('i');
        
        // Thay đổi màu icon khi nhấn (từ trắng sang đỏ và ngược lại)
        icon.classList.toggle('text-danger');

        // Gọi hàm thêm vào wishlist
        addToWishlist(productId);
    });
});

// Hàm thêm sản phẩm vào wishlist
function addToWishlist(productId) {
    console.log(`Added product ID: ${productId} to wishlist`);
   
    // fetch(`/api/wishlist/add/${productId}`, { method: 'POST' })
    //     .then(response => response.json())
    //     .then(data => console.log('Product added to wishlist:', data))
    //     .catch(error => console.error('Error:', error));
}

// Xử lý sự kiện thêm vào giỏ hàng
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const icon = this.querySelector('i');
        
        // Thay đổi màu icon khi nhấn
        icon.classList.toggle('text-success');

        // Gọi hàm thêm vào giỏ hàng
        addToCart(productId);
    });
});

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    console.log(`Added product ID: ${productId} to cart`);
    
    // fetch(`/api/cart/add/${productId}`, { method: 'POST' })
    //     .then(response => response.json())
    //     .then(data => console.log('Product added:', data))
    //     .catch(error => console.error('Error:', error));
}

// Xử lý nút "Move All To Bag"
document.querySelector('.btn-outline-primary').addEventListener('click', function() {
    document.querySelectorAll('.add-to-bag-btn i').forEach(icon => {
        icon.classList.add('text-danger');
    });
    console.log('Moved all to bag');
});