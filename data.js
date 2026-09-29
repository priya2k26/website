// Data for the Order Management System

const API_URL = 'http://localhost:3000/api';
// Valid user credentials
const VALID_CREDENTIALS = {
    email: 'admin@restaurant.com',
    password: '123456'
};

// Restaurant Tables
const TABLES = [
    { id: 1, number: 1, status: 'available', capacity: 4 },
    { id: 2, number: 2, status: 'available', capacity: 2 },
    { id: 3, number: 3, status: 'available', capacity: 4 },
    { id: 4, number: 4, status: 'available', capacity: 5 },
    { id: 5, number: 5, status: 'available', capacity: 2 },
    { id: 6, number: 6, status: 'available', capacity: 4 },
    { id: 7, number: 7, status: 'available', capacity: 6 },
    { id: 8, number: 8, status: 'available', capacity: 4 },
    { id: 9, number: 9, status: 'available', capacity: 2 },
    { id: 10, number: 10, status: 'available', capacity: 5 },
    { id: 11, number: 11, status: 'available', capacity: 4 },
    { id: 12, number: 12, status: 'available', capacity: 2 },
    { id: 13, number: 13, status: 'available', capacity: 6 },
    { id: 14, number: 14, status: 'available', capacity: 4 },
    { id: 15, number: 15, status: 'available', capacity: 5 },
];

// Food Menu Items
const MENU_ITEMS = [
    { id: 1, name: 'Idli', category: 'Main Dishes', price: 180, description: 'Delicious Idli', timeOfDay: 'Morning', image: 'images/idli_real.png' },
    { id: 2, name: 'Plain Dosa', category: 'Main Dishes', price: 150, description: 'Delicious Plain Dosa', timeOfDay: 'Morning', image: 'images/plain_dosa_real.png' },
    { id: 3, name: 'Masala Dosa', category: 'Main Dishes', price: 30, description: 'Delicious Masala Dosa', timeOfDay: 'Morning', image: 'images/masala_dosa_real.png' },
    { id: 4, name: 'Pongal', category: 'Main Dishes', price: 30, description: 'Delicious Pongal', timeOfDay: 'Morning', image: 'images/pongal_real.png' },
    { id: 5, name: 'Poori', category: 'Main Dishes', price: 40, description: 'Delicious Poori', timeOfDay: 'Morning', image: 'images/poori_real.png' },
    { id: 6, name: 'Vada', category: 'Main Dishes', price: 30, description: 'Delicious Vada', timeOfDay: 'Morning', image: 'images/vada_real.png' },
    { id: 7, name: 'Upma', category: 'Main Dishes', price: 50, description: 'Delicious Upma', timeOfDay: 'Morning', image: 'images/upma_real.png' },
    { id: 8, name: 'Idiyappam', category: 'Main Dishes', price: 150, description: 'Delicious Idiyappam', timeOfDay: 'Morning', image: 'images/idiyappam_real.png' },
    { id: 9, name: 'Appam', category: 'Main Dishes', price: 120, description: 'Delicious Appam', timeOfDay: 'Morning', image: 'images/appam_real.png' },
    { id: 10, name: 'Puttu', category: 'Main Dishes', price: 100, description: 'Delicious Puttu', timeOfDay: 'Morning', image: 'images/puttu_real.png' },
    { id: 11, name: 'Sambar Rice', category: 'Main Dishes', price: 20, description: 'Delicious Sambar Rice', timeOfDay: 'Afternoon', image: 'images/sambar_rice_real.png' },
    { id: 12, name: 'Curd Rice', category: 'Main Dishes', price: 40, description: 'Delicious Curd Rice', timeOfDay: 'Afternoon', image: 'images/curd_rice.png' },
    { id: 13, name: 'Lemon Rice', category: 'Main Dishes', price: 120, description: 'Delicious Lemon Rice', timeOfDay: 'Afternoon', image: 'images/lemon_rice.png' },
    { id: 14, name: 'Tomato Rice', category: 'Main Dishes', price: 180, description: 'Delicious Tomato Rice', timeOfDay: 'Afternoon', image: 'images/tomato_rice.png' },
    { id: 15, name: 'Tamarind Rice', category: 'Main Dishes', price: 100, description: 'Delicious Tamarind Rice', timeOfDay: 'Afternoon', image: 'images/tamarind_rice.png' },
    { id: 16, name: 'Vegetable Biryani', category: 'Main Dishes', price: 200, description: 'Delicious Vegetable Biryani', timeOfDay: 'Afternoon', image: 'images/veg_biryani.png' },
    { id: 17, name: 'Chicken Biryani', category: 'Main Dishes', price: 250, description: 'Delicious Chicken Biryani', timeOfDay: 'Afternoon', image: 'images/chicken_biryani.png' },
    { id: 18, name: 'Mutton Biryani', category: 'Main Dishes', price: 200, description: 'Delicious Mutton Biryani', timeOfDay: 'Afternoon', image: 'images/mutton_biryani.png' },
    { id: 19, name: 'Chicken Rice', category: 'Main Dishes', price: 150, description: 'Delicious Chicken Rice', timeOfDay: 'Afternoon', image: 'images/chicken_rice.png' },
    { id: 20, name: 'Veg Meals', category: 'Main Dishes', price: 100, description: 'Delicious Veg Meals', timeOfDay: 'Afternoon', image: 'images/veg_meals.png' },
    { id: 21, name: 'Chapati', category: 'Main Dishes', price: 80, description: 'Delicious Chapati', timeOfDay: 'Night', image: 'images/chapati.png' },
    { id: 22, name: 'Parotta', category: 'Main Dishes', price: 30, description: 'Delicious Parotta', timeOfDay: 'Night', image: 'images/parotta.png' },
    { id: 23, name: 'Kothu Parotta', category: 'Main Dishes', price: 120, description: 'Delicious Kothu Parotta', timeOfDay: 'Night', image: 'images/kothu_parotta.png' },
    { id: 24, name: 'Naan', category: 'Main Dishes', price: 150, description: 'Delicious Naan', timeOfDay: 'Night', image: 'images/naan.png' },
    { id: 25, name: 'Roti', category: 'Main Dishes', price: 100, description: 'Delicious Roti', timeOfDay: 'Night', image: 'images/roti.png' },
    { id: 26, name: 'Fried Rice', category: 'Main Dishes', price: 80, description: 'Delicious Fried Rice', timeOfDay: 'Night', image: 'images/fried_rice.png' },
    { id: 27, name: 'Chicken Fried Rice', category: 'Main Dishes', price: 180, description: 'Delicious Chicken Fried Rice', timeOfDay: 'Night', image: 'images/chicken_fried_rice.png' },
    { id: 28, name: 'Veg Fried Rice', category: 'Main Dishes', price: 80, description: 'Delicious Veg Fried Rice', timeOfDay: 'Night', image: 'images/veg_fried_rice.png' },
    { id: 29, name: 'Chicken Noodles', category: 'Main Dishes', price: 100, description: 'Delicious Chicken Noodles', timeOfDay: 'Night', image: 'images/chicken_noodles.png' },
    { id: 30, name: 'Veg Noodles', category: 'Main Dishes', price: 120, description: 'Delicious Veg Noodles', timeOfDay: 'Night', image: 'images/veg_noodles.png' },
    { id: 31, name: 'Sambar', category: 'Side Dishes', price: 30, description: 'Delicious Sambar', timeOfDay: 'Morning', image: 'images/sambar.png' },
    { id: 32, name: 'Coconut Chutney', category: 'Side Dishes', price: 30, description: 'Delicious Coconut Chutney', timeOfDay: 'Morning', image: 'images/coconut_chutney.png' },
    { id: 33, name: 'Tomato Chutney', category: 'Side Dishes', price: 20, description: 'Delicious Tomato Chutney', timeOfDay: 'Morning', image: 'images/tomato_chutney.png' },
    { id: 34, name: 'Mint Chutney', category: 'Side Dishes', price: 30, description: 'Delicious Mint Chutney', timeOfDay: 'Morning', image: 'images/mint_chutney.png' },
    { id: 35, name: 'Onion Chutney', category: 'Side Dishes', price: 20, description: 'Delicious Onion Chutney', timeOfDay: 'Morning', image: 'images/onion_chutney.png' },
    { id: 36, name: 'Peanut Chutney', category: 'Side Dishes', price: 20, description: 'Delicious Peanut Chutney', timeOfDay: 'Morning', image: 'images/peanut_chutney.png' },
    { id: 37, name: 'Vada Curry', category: 'Side Dishes', price: 50, description: 'Delicious Vada Curry', timeOfDay: 'Morning', image: 'images/vada_curry.png' },
    { id: 38, name: 'Potato Masala', category: 'Side Dishes', price: 80, description: 'Delicious Potato Masala', timeOfDay: 'Morning', image: 'images/potato_masala.png' },
    { id: 39, name: 'Vegetable Poriyal', category: 'Side Dishes', price: 180, description: 'Delicious Vegetable Poriyal', timeOfDay: 'Afternoon', image: 'images/vegetable_poriyal.png' },
    { id: 40, name: 'Potato Fry', category: 'Side Dishes', price: 120, description: 'Delicious Potato Fry', timeOfDay: 'Afternoon', image: 'images/potato_fry.png' },
    { id: 41, name: 'Beans Poriyal', category: 'Side Dishes', price: 120, description: 'Delicious Beans Poriyal', timeOfDay: 'Afternoon', image: 'images/beans_poriyal.png' },
    { id: 42, name: 'Carrot Poriyal', category: 'Side Dishes', price: 120, description: 'Delicious Carrot Poriyal', timeOfDay: 'Afternoon', image: 'images/carrot_poriyal.png' },
    { id: 43, name: 'Cabbage Poriyal', category: 'Side Dishes', price: 80, description: 'Delicious Cabbage Poriyal', timeOfDay: 'Afternoon', image: 'images/cabbage_poriyal.png' },
    { id: 44, name: 'Avial', category: 'Side Dishes', price: 30, description: 'Delicious Avial', timeOfDay: 'Afternoon', image: 'images/avial.png' },
    { id: 45, name: 'Kootu', category: 'Side Dishes', price: 40, description: 'Delicious Kootu', timeOfDay: 'Afternoon', image: 'images/kootu.png' },
    { id: 46, name: 'Rasam', category: 'Side Dishes', price: 180, description: 'Delicious Rasam', timeOfDay: 'Afternoon', image: 'images/rasam.png' },
    { id: 47, name: 'Sambar', category: 'Side Dishes', price: 30, description: 'Delicious Sambar', timeOfDay: 'Afternoon', image: 'images/sambar_afternoon.png' },
    { id: 48, name: 'Appalam', category: 'Side Dishes', price: 180, description: 'Delicious Appalam', timeOfDay: 'Afternoon', image: 'images/appalam.png' },
    { id: 49, name: 'Pickle', category: 'Side Dishes', price: 30, description: 'Delicious Pickle', timeOfDay: 'Afternoon', image: 'images/pickle.png' },
    { id: 50, name: 'Curd', category: 'Side Dishes', price: 100, description: 'Delicious Curd', timeOfDay: 'Afternoon', image: 'images/curd.png' },
    { id: 51, name: 'Vegetable Kurma', category: 'Side Dishes', price: 180, description: 'Delicious Vegetable Kurma', timeOfDay: 'Night', image: 'images/vegetable_kurma.png' },
    { id: 52, name: 'Chicken Gravy', category: 'Side Dishes', price: 180, description: 'Delicious Chicken Gravy', timeOfDay: 'Night', image: 'images/chicken_gravy.png' },
    { id: 53, name: 'Mutton Gravy', category: 'Side Dishes', price: 180, description: 'Delicious Mutton Gravy', timeOfDay: 'Night', image: 'images/mutton_gravy.png' },
    { id: 54, name: 'Paneer Gravy', category: 'Side Dishes', price: 150, description: 'Delicious Paneer Gravy', timeOfDay: 'Night', image: 'images/paneer_gravy.png' },
    { id: 55, name: 'Chana Masala', category: 'Side Dishes', price: 120, description: 'Delicious Chana Masala', timeOfDay: 'Night', image: 'images/chana_masala.png' },
    { id: 56, name: 'Dal Fry', category: 'Side Dishes', price: 100, description: 'Delicious Dal Fry', timeOfDay: 'Night', image: 'images/dal_fry.png' },
    { id: 57, name: 'Mushroom Masala', category: 'Side Dishes', price: 150, description: 'Delicious Mushroom Masala', timeOfDay: 'Night', image: 'images/mushroom_masala.png' },
    { id: 58, name: 'Onion Raita', category: 'Side Dishes', price: 80, description: 'Delicious Onion Raita', timeOfDay: 'Night', image: 'images/onion_raita.png' },
    { id: 59, name: 'Cucumber Raita', category: 'Side Dishes', price: 120, description: 'Delicious Cucumber Raita', timeOfDay: 'Night', image: 'images/cucumber_raita.png' },
    { id: 60, name: 'Mixed Vegetable Curry', category: 'Side Dishes', price: 100, description: 'Delicious Mixed Vegetable Curry', timeOfDay: 'Night', image: 'images/mixed_vegetable_curry.png' },
    { id: 61, name: 'Tea', category: 'Drinks', price: 60, description: 'Delicious Tea', timeOfDay: 'Morning', image: 'images/tea.png' },
    { id: 62, name: 'Coffee', category: 'Drinks', price: 40, description: 'Delicious Coffee', timeOfDay: 'Morning', image: 'images/coffee.png' },
    { id: 63, name: 'Milk', category: 'Drinks', price: 30, description: 'Delicious Milk', timeOfDay: 'Morning', image: 'images/milk.png' },
    { id: 64, name: 'Horlicks', category: 'Drinks', price: 40, description: 'Delicious Horlicks', timeOfDay: 'Morning', image: 'images/horlicks.png' },
    { id: 65, name: 'Badam Milk', category: 'Drinks', price: 30, description: 'Delicious Badam Milk', timeOfDay: 'Morning', image: 'images/badam_milk.png' },
    { id: 66, name: 'Fresh Lime Juice', category: 'Drinks', price: 20, description: 'Delicious Fresh Lime Juice', timeOfDay: 'Morning', image: 'images/fresh_lime_juice.png' },
    { id: 67, name: 'Fresh Lime Soda', category: 'Drinks', price: 60, description: 'Delicious Fresh Lime Soda', timeOfDay: 'Afternoon', image: 'images/fresh_lime_soda.png' },
    { id: 68, name: 'Lemon Juice', category: 'Drinks', price: 50, description: 'Delicious Lemon Juice', timeOfDay: 'Afternoon', image: 'images/lemon_juice.png' },
    { id: 69, name: 'Watermelon Juice', category: 'Drinks', price: 60, description: 'Delicious Watermelon Juice', timeOfDay: 'Afternoon', image: 'images/watermelon_juice.png' },
    { id: 70, name: 'Orange Juice', category: 'Drinks', price: 20, description: 'Delicious Orange Juice', timeOfDay: 'Afternoon', image: 'images/orange_juice.png' },
    { id: 71, name: 'Pineapple Juice', category: 'Drinks', price: 20, description: 'Delicious Pineapple Juice', timeOfDay: 'Afternoon', image: 'images/pineapple_juice.png' },
    { id: 72, name: 'Mango Juice', category: 'Drinks', price: 60, description: 'Delicious Mango Juice', timeOfDay: 'Afternoon', image: 'images/mango_juice.png' },
    { id: 73, name: 'Buttermilk', category: 'Drinks', price: 30, description: 'Delicious Buttermilk', timeOfDay: 'Afternoon', image: 'images/buttermilk.png' },
    { id: 74, name: 'Lassi', category: 'Drinks', price: 40, description: 'Delicious Lassi', timeOfDay: 'Afternoon', image: 'images/lassi.png' },
    { id: 75, name: 'Tender Coconut Water', category: 'Drinks', price: 50, description: 'Delicious Tender Coconut Water', timeOfDay: 'Afternoon', image: 'images/tender_coconut_water.png' },
    { id: 76, name: 'Tea', category: 'Drinks', price: 40, description: 'Delicious Tea', timeOfDay: 'Night', image: 'images/tea.png' },
    { id: 77, name: 'Coffee', category: 'Drinks', price: 40, description: 'Delicious Coffee', timeOfDay: 'Night', image: 'images/coffee.png' },
    { id: 78, name: 'Milk', category: 'Drinks', price: 30, description: 'Delicious Milk', timeOfDay: 'Night', image: 'images/milk.png' },
    { id: 79, name: 'Badam Milk', category: 'Drinks', price: 20, description: 'Delicious Badam Milk', timeOfDay: 'Night', image: 'images/badam_milk.png' },
    { id: 80, name: 'Rose Milk', category: 'Drinks', price: 40, description: 'Delicious Rose Milk', timeOfDay: 'Night', image: 'images/rose_milk.png' },
    { id: 81, name: 'Hot Chocolate', category: 'Drinks', price: 50, description: 'Delicious Hot Chocolate', timeOfDay: 'Night', image: 'images/hot_chocolate.png' },
    { id: 82, name: 'Fresh Lime Juice', category: 'Drinks', price: 40, description: 'Delicious Fresh Lime Juice', timeOfDay: 'Night', image: 'images/fresh_lime_juice.png' },

];

// Generate unique Order ID
function generateOrderId() {
    return 'ORD-' + Date.now();
}

// Get items by category
function getItemsByCategory(category) {
    return MENU_ITEMS.filter(item => item.category === category);
}

// Get all categories
function getAllCategories() {
    return [...new Set(MENU_ITEMS.map(item => item.category))];
}

// Calculate category counts for confirmed order
function getCategoryCounts(selectedItems) {
    const counts = {};
    getAllCategories().forEach(category => {
        counts[category] = selectedItems.filter(item => item.category === category).length;
    });
    return counts;
}
