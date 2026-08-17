# Order Management Website - Complete Documentation

## Project Overview
A full-featured restaurant order management system built with HTML, CSS, and JavaScript. This website manages the complete order workflow from login through billing.

## 📁 Project Structure
```
website/
├── index.html                    # Login page
├── tables.html                   # Table management page
├── food-selection.html          # Food menu selection page
├── order-confirmation.html      # Order confirmation page
├── food-categories.html         # Food categories overview
├── main-dishes.html             # Main dishes category page
├── side-dishes.html             # Side dishes category page
├── drinks.html                  # Drinks category page
├── preparation-tracking.html    # Food preparation tracking page
├── ready-orders.html            # Ready orders & table status page
├── bill.html                    # Bill/Invoice page
├── styles.css                   # All styling (responsive design)
├── data.js                      # Data & configuration
└── script.js                    # All functionality & state management
```

## 🔐 Login Credentials
- **Email**: admin@restaurant.com
- **Password**: 123456

## 🎯 Complete User Flow

### 1. **Login Page** (index.html)
- User enters Email ID and Password
- Demo credentials provided
- Validates login and redirects to Tables page

### 2. **Table Management** (tables.html)
- Displays all 10 restaurant tables
- Shows table number and current status (Available/Occupied)
- Click a table to start placing an order
- Only available tables can be selected

### 3. **Food Selection** (food-selection.html)
- Left side: Complete food menu with categories
- Right side: Selected items panel
- Menu items include:
  - **Main Dishes**: Biryani, Chicken Curry, Mutton Curry, Paneer Tikka Masala, Fish Curry
  - **Side Dishes**: Vada, Dosa, Samosa, Pakora, Naan, Rice
  - **Drinks**: Tea, Coffee, Mango Lassi, Lemonade, Cola, Water
- Add items with "+" button
- Adjust quantities with +/- buttons
- Remove items with Remove button
- Real-time total calculation

### 4. **Order Confirmation** (order-confirmation.html)
- Display order summary with:
  - Table number
  - Auto-generated Order ID
  - Selected food items in table format
  - Individual and total prices
- Confirm order to proceed
- Order is automatically categorized by food type

### 5. **Food Categories Pages**
Three separate pages for organized item viewing:
- **Main Dishes** (main-dishes.html) - Shows all main course items
- **Side Dishes** (side-dishes.html) - Shows all side dishes
- **Drinks** (drinks.html) - Shows all beverages
- Each shows item details with quantity, price, and preparation controls

### 6. **Food Categories Hub** (food-categories.html)
- Overview page showing all categories
- Category cards with item counts
- Complete order summary table
- Navigate to individual category pages
- Shows total order price

### 7. **Food Preparation Tracking** (preparation-tracking.html)
- Real-time progress tracking for each ordered item
- Progress bar (0-100%) for each item
- Timeline showing Start → Ready progression
- Status indicators (Preparing/Ready)
- Order details display

### 8. **Ready Orders Status** (ready-orders.html)
- Table status grid showing which tables have ready orders
- Visual checkmark (✓) when all items are ready
- Complete orders status table
- Shows ready items count vs total items
- Links to bill page for ready orders

### 9. **Bill Page** (bill.html)
- Professional invoice format
- Shows:
  - Table number
  - Order ID
  - Date & Time
  - All ordered items with details
  - Unit prices and totals
  - 5% tax calculation
  - **Grand Total Amount**
- Payment status tracking
- Actions:
  - Print Bill
  - Mark as Paid
  - Complete Order (marks table as available)

## 🎨 UI/UX Features

### Modern Design
- Gradient backgrounds (purple/blue theme)
- Clean, professional cards and layouts
- Smooth transitions and hover effects
- Responsive grid layouts

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive grid layouts
- Touch-friendly buttons and controls

### Color Scheme
- **Primary**: Purple/Blue gradients (#667eea - #764ba2)
- **Success**: Green (#4caf50)
- **Warning**: Yellow/Orange
- **Error**: Red (#ff5252)
- **Info**: Light Blue

## 🔧 Technical Details

### Data Management (data.js)
- 10 restaurant tables (Table 1-10)
- 17 food items across 3 categories
- Pricing structure for all items
- Order ID generation function
- Category filtering functions

### State Management (script.js)
- Global state object tracking:
  - Login status
  - Selected table
  - Selected items with quantities
  - Current order details
  - All orders (stored in localStorage)
  - Table statuses

### Features Implemented

#### Login System
- Email and password validation
- Session tracking
- Logout functionality

#### Table Management
- Visual status indicators
- Available/Occupied states
- Table selection for ordering

#### Food Selection
- Add items to cart
- Quantity management (+/- buttons)
- Remove items
- Real-time price calculation
- Category badges for each item

#### Order Processing
- Auto-generated Order IDs
- Order confirmation with details
- Automatic categorization by food type
- Order storage in localStorage

#### Preparation Tracking
- Visual progress bars
- Item-by-item status
- Real-time progress simulation
- Timeline visualization

#### Order Status & Billing
- Table status overview
- Ready order identification
- Professional bill formatting
- Tax calculation (5%)
- Payment status tracking
- Print functionality

## 📊 Data Structure

### Menu Items
Each item has:
- ID, Name, Category, Price, Description

### Orders
Each order contains:
- Order ID, Table Number, Items, Status
- Total Price, Created Timestamp
- Preparation Progress (per item)
- Payment Status, Completion Status

### Tables
Each table has:
- ID, Number, Status
- Associated Order ID (if occupied)

## 🚀 How to Use

1. **Start**: Open `index.html` in a web browser
2. **Login**: Use demo credentials
3. **Select Table**: Choose an available table
4. **Select Items**: Add food items to your order
5. **Confirm**: Review and confirm the order
6. **View Categories**: Browse items by category
7. **Track Preparation**: Monitor food preparation progress
8. **Check Status**: View when orders are ready
9. **View Bill**: See itemized bill with total
10. **Complete**: Mark order as paid and complete

## 💾 Data Persistence
- Orders are stored in browser's localStorage
- Data persists across browser sessions
- Table statuses updated in real-time

## 🔒 Security Note
This is a demo/educational project. In production:
- Implement proper backend authentication
- Use secure password hashing
- Add database for order storage
- Implement payment gateway
- Add user role management

## 📱 Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## ✨ Highlights
- **8+ Pages** with complete workflow
- **Modern UI** with gradient designs
- **Responsive Design** for all devices
- **Real-time Calculation** of prices
- **Progress Tracking** with visual indicators
- **Professional Billing** with tax calculation
- **LocalStorage** for data persistence
- **Print Functionality** for invoices

## 🎓 Learning Features
This project demonstrates:
- HTML5 semantic structure
- CSS3 advanced layouts (Grid, Flexbox)
- Responsive design techniques
- JavaScript state management
- DOM manipulation
- LocalStorage API usage
- Event handling
- Form validation
- Navigation between pages
- Data flow management

---

**Ready to use!** Simply open `index.html` in any modern web browser and start managing orders.
