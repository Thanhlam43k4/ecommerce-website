CREATE DATABASE uet_store;
USE uet_store;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_urls TEXT, 
    category_id INT,
    seller_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    buyer_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chatbot_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

--Chèn dữ liệu vào bảng users
INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES
('admin', 'group11@gmail.com', 'admin', 'admin', '2025-03-05 12:44:00', '2025-03-05 12:44:00'),
('dodevice', 'dodevice@gmail.com', 'dodevice', 'user', '2025-03-05 12:44:00', '2025-03-05 12:44:00'),
('thanhlam', 'thanhlam@gmail.com', 'thanhlam', 'user', '2025-03-05 12:44:00', '2025-03-05 12:44:00'),
('thanhhung', 'thanhhung@gmail.com', 'thanhhung', 'user', '2025-03-05 12:44:00', '2025-03-05 12:44:00'),
('duonglong', 'duonglong@gmail.com', 'duonglong', 'user', '2025-03-05 12:44:00', '2025-03-05 12:44:00'),
('ngohieu', 'ngohieu@gmail.com', 'ngohieu', 'user', '2025-03-05 12:44:00', '2025-03-05 12:44:00');



-- Chèn dữ liệu vào bảng categories
INSERT INTO categories (name, description) VALUES
('Phones', 'Various smartphones and mobile devices.'),
('Computers', 'Desktops, laptops, and related accessories.'),
('SmartWatches', 'Smart wearable devices with multiple functionalities.'),
('Cameras', 'Digital cameras and photography equipment.'),
('Headphones', 'Audio devices including headphones and earphones.'),
('Gaming', 'Gaming consoles, accessories, and related products.');



-- Chèn dữ liệu vào bảng products
INSERT INTO products (name, description, price, stock, image_urls, category_id) VALUES
('iPhone 13', 'Latest Apple smartphone with A15 Bionic chip.', 999.99, 50, 'iphone13.jpg', 1),
('Samsung Galaxy S21', 'Flagship Samsung smartphone with high-end features.', 899.99, 35, 'galaxy_s21.jpg', 1),
('MacBook Pro 14"', 'Apple laptop with M1 Pro chip.', 1999.99, 20, 'macbook_pro_14.jpg', 2),
('Dell XPS 13', 'Compact and powerful ultrabook from Dell.', 1099.99, 25, 'dell_xps_13.jpg', 2),
('Apple Watch Series 7', 'Newest Apple smartwatch with health tracking.', 399.99, 60, 'apple_watch_series_7.jpg', 3),
('Samsung Galaxy Watch 4', 'Samsung smartwatch with advanced features.', 349.99, 40, 'galaxy_watch_4.jpg', 3),
('Canon EOS R5', 'High-resolution mirrorless camera from Canon.', 3899.99, 15, 'canon_eos_r5.jpg', 4),
('Sony A7 IV', 'Versatile full-frame mirrorless camera.', 2499.99, 10, 'sony_a7_iv.jpg', 4),
('Sony WH-1000XM4', 'Industry-leading noise-canceling headphones.', 349.99, 80, 'sony_wh_1000xm4.jpg', 5),
('Bose QuietComfort 35 II', 'Comfortable noise-canceling headphones.', 299.99, 70, 'bose_qc35_ii.jpg', 5),
('PlayStation 5', 'Next-gen gaming console from Sony.', 499.99, 30, 'ps5.jpg', 6),
('Xbox Series X', 'Microsoft''s latest gaming console.', 499.99, 25, 'xbox_series_x.jpg', 6);
