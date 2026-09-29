CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tables (
  id INT PRIMARY KEY,
  status ENUM('Available', 'Occupied') DEFAULT 'Available',
  current_order_id VARCHAR(50) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  table_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('Preparing', 'Ready', 'Paid', 'Completed') DEFAULT 'Preparing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  preparation_progress INT DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Seed initial data

-- Insert an admin user (password is '123456' hashed with bcrypt)
-- You can generate new hashes using a bcrypt tool, this is $2a$10$X... for '123456'
INSERT IGNORE INTO users (email, password) VALUES 
('admin@restaurant.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa');

-- Insert Tables
INSERT IGNORE INTO tables (id, status) VALUES 
(1, 'Available'), (2, 'Available'), (3, 'Available'), (4, 'Available'), (5, 'Available'),
(6, 'Available'), (7, 'Available'), (8, 'Available'), (9, 'Available'), (10, 'Available');

-- Insert Menu Items (Matching frontend data.js)
INSERT IGNORE INTO menu_items (id, name, category, price, description) VALUES
(1, 'Idli', 'Main Dishes', 180, 'Delicious Idli'),
(2, 'Plain Dosa', 'Main Dishes', 150, 'Delicious Plain Dosa'),
(3, 'Masala Dosa', 'Main Dishes', 30, 'Delicious Masala Dosa'),
(4, 'Pongal', 'Main Dishes', 30, 'Delicious Pongal'),
(5, 'Poori', 'Main Dishes', 40, 'Delicious Poori'),
(6, 'Vada', 'Main Dishes', 30, 'Delicious Vada'),
(7, 'Upma', 'Main Dishes', 50, 'Delicious Upma'),
(8, 'Idiyappam', 'Main Dishes', 150, 'Delicious Idiyappam'),
(9, 'Appam', 'Main Dishes', 120, 'Delicious Appam'),
(10, 'Puttu', 'Main Dishes', 100, 'Delicious Puttu'),
(11, 'Sambar Rice', 'Main Dishes', 20, 'Delicious Sambar Rice'),
(12, 'Curd Rice', 'Main Dishes', 40, 'Delicious Curd Rice'),
(13, 'Lemon Rice', 'Main Dishes', 120, 'Delicious Lemon Rice'),
(14, 'Tomato Rice', 'Main Dishes', 180, 'Delicious Tomato Rice'),
(15, 'Tamarind Rice', 'Main Dishes', 100, 'Delicious Tamarind Rice'),
(16, 'Vegetable Biryani', 'Main Dishes', 200, 'Delicious Vegetable Biryani'),
(17, 'Chicken Biryani', 'Main Dishes', 250, 'Delicious Chicken Biryani'),
(18, 'Mutton Biryani', 'Main Dishes', 200, 'Delicious Mutton Biryani'),
(19, 'Chicken Rice', 'Main Dishes', 150, 'Delicious Chicken Rice'),
(20, 'Veg Meals', 'Main Dishes', 100, 'Delicious Veg Meals'),
(21, 'Chapati', 'Main Dishes', 80, 'Delicious Chapati'),
(22, 'Parotta', 'Main Dishes', 30, 'Delicious Parotta'),
(23, 'Kothu Parotta', 'Main Dishes', 120, 'Delicious Kothu Parotta'),
(24, 'Naan', 'Main Dishes', 150, 'Delicious Naan'),
(25, 'Roti', 'Main Dishes', 100, 'Delicious Roti'),
(26, 'Fried Rice', 'Main Dishes', 80, 'Delicious Fried Rice'),
(27, 'Chicken Fried Rice', 'Main Dishes', 180, 'Delicious Chicken Fried Rice'),
(28, 'Veg Fried Rice', 'Main Dishes', 80, 'Delicious Veg Fried Rice'),
(29, 'Chicken Noodles', 'Main Dishes', 100, 'Delicious Chicken Noodles'),
(30, 'Veg Noodles', 'Main Dishes', 120, 'Delicious Veg Noodles'),
(31, 'Sambar', 'Side Dishes', 30, 'Delicious Sambar'),
(32, 'Coconut Chutney', 'Side Dishes', 30, 'Delicious Coconut Chutney'),
(33, 'Tomato Chutney', 'Side Dishes', 20, 'Delicious Tomato Chutney'),
(34, 'Mint Chutney', 'Side Dishes', 30, 'Delicious Mint Chutney'),
(35, 'Onion Chutney', 'Side Dishes', 20, 'Delicious Onion Chutney'),
(36, 'Peanut Chutney', 'Side Dishes', 20, 'Delicious Peanut Chutney'),
(37, 'Vada Curry', 'Side Dishes', 50, 'Delicious Vada Curry'),
(38, 'Potato Masala', 'Side Dishes', 80, 'Delicious Potato Masala'),
(39, 'Vegetable Poriyal', 'Side Dishes', 180, 'Delicious Vegetable Poriyal'),
(40, 'Potato Fry', 'Side Dishes', 120, 'Delicious Potato Fry'),
(41, 'Beans Poriyal', 'Side Dishes', 120, 'Delicious Beans Poriyal'),
(42, 'Carrot Poriyal', 'Side Dishes', 120, 'Delicious Carrot Poriyal'),
(43, 'Cabbage Poriyal', 'Side Dishes', 80, 'Delicious Cabbage Poriyal'),
(44, 'Avial', 'Side Dishes', 30, 'Delicious Avial'),
(45, 'Kootu', 'Side Dishes', 40, 'Delicious Kootu'),
(46, 'Rasam', 'Side Dishes', 180, 'Delicious Rasam'),
(47, 'Sambar', 'Side Dishes', 30, 'Delicious Sambar'),
(48, 'Appalam', 'Side Dishes', 180, 'Delicious Appalam'),
(49, 'Pickle', 'Side Dishes', 30, 'Delicious Pickle'),
(50, 'Curd', 'Side Dishes', 100, 'Delicious Curd'),
(51, 'Vegetable Kurma', 'Side Dishes', 180, 'Delicious Vegetable Kurma'),
(52, 'Chicken Gravy', 'Side Dishes', 180, 'Delicious Chicken Gravy'),
(53, 'Mutton Gravy', 'Side Dishes', 180, 'Delicious Mutton Gravy'),
(54, 'Paneer Gravy', 'Side Dishes', 150, 'Delicious Paneer Gravy'),
(55, 'Chana Masala', 'Side Dishes', 120, 'Delicious Chana Masala'),
(56, 'Dal Fry', 'Side Dishes', 100, 'Delicious Dal Fry'),
(57, 'Mushroom Masala', 'Side Dishes', 150, 'Delicious Mushroom Masala'),
(58, 'Onion Raita', 'Side Dishes', 80, 'Delicious Onion Raita'),
(59, 'Cucumber Raita', 'Side Dishes', 120, 'Delicious Cucumber Raita'),
(60, 'Mixed Vegetable Curry', 'Side Dishes', 100, 'Delicious Mixed Vegetable Curry'),
(61, 'Tea', 'Drinks', 60, 'Delicious Tea'),
(62, 'Coffee', 'Drinks', 40, 'Delicious Coffee'),
(63, 'Milk', 'Drinks', 30, 'Delicious Milk'),
(64, 'Horlicks', 'Drinks', 40, 'Delicious Horlicks'),
(65, 'Badam Milk', 'Drinks', 30, 'Delicious Badam Milk'),
(66, 'Fresh Lime Juice', 'Drinks', 20, 'Delicious Fresh Lime Juice'),
(67, 'Fresh Lime Soda', 'Drinks', 60, 'Delicious Fresh Lime Soda'),
(68, 'Lemon Juice', 'Drinks', 50, 'Delicious Lemon Juice'),
(69, 'Watermelon Juice', 'Drinks', 60, 'Delicious Watermelon Juice'),
(70, 'Orange Juice', 'Drinks', 20, 'Delicious Orange Juice'),
(71, 'Pineapple Juice', 'Drinks', 20, 'Delicious Pineapple Juice'),
(72, 'Mango Juice', 'Drinks', 60, 'Delicious Mango Juice'),
(73, 'Buttermilk', 'Drinks', 30, 'Delicious Buttermilk'),
(74, 'Lassi', 'Drinks', 40, 'Delicious Lassi'),
(75, 'Tender Coconut Water', 'Drinks', 50, 'Delicious Tender Coconut Water'),
(76, 'Tea', 'Drinks', 40, 'Delicious Tea'),
(77, 'Coffee', 'Drinks', 40, 'Delicious Coffee'),
(78, 'Milk', 'Drinks', 30, 'Delicious Milk'),
(79, 'Badam Milk', 'Drinks', 20, 'Delicious Badam Milk'),
(80, 'Rose Milk', 'Drinks', 40, 'Delicious Rose Milk'),
(81, 'Hot Chocolate', 'Drinks', 50, 'Delicious Hot Chocolate'),
(82, 'Fresh Lime Juice', 'Drinks', 40, 'Delicious Fresh Lime Juice');
