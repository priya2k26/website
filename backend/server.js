const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const authenticateToken = require('./middleware/auth');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Authentication Endpoints ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Menu Endpoints ---

app.get('/api/menu', authenticateToken, async (req, res) => {
  try {
    const [items] = await db.execute('SELECT * FROM menu_items');
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Tables Endpoints ---

app.get('/api/tables', authenticateToken, async (req, res) => {
  try {
    const [tables] = await db.execute('SELECT * FROM tables');
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tables/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, current_order_id } = req.body;
  try {
    await db.execute(
      'UPDATE tables SET status = ?, current_order_id = ? WHERE id = ?',
      [status, current_order_id || null, id]
    );
    res.json({ message: 'Table updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Orders Endpoints ---

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute('SELECT * FROM orders');
    // Fetch items for each order
    for (let order of orders) {
      const [items] = await db.execute(`
        SELECT oi.*, m.name, m.category, m.price 
        FROM order_items oi 
        JOIN menu_items m ON oi.menu_item_id = m.id 
        WHERE oi.order_id = ?
      `, [order.id]);
      
      // Map to frontend expected format
      order.items = items.map(item => ({
        id: item.menu_item_id,
        name: item.name,
        category: item.category,
        price: parseFloat(item.price),
        quantity: item.quantity,
        preparationProgress: item.preparation_progress
      }));
    }
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { id, tableNumber, totalAmount, items } = req.body;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Create order
    await connection.execute(
      'INSERT INTO orders (id, table_id, total_price, status) VALUES (?, ?, ?, ?)',
      [id, tableNumber, totalAmount, 'Preparing']
    );
    
    // Insert order items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
        [id, item.id, item.quantity]
      );
    }
    
    // Update table status
    await connection.execute(
      'UPDATE tables SET status = ?, current_order_id = ? WHERE id = ?',
      ['Occupied', id, tableNumber]
    );
    
    await connection.commit();
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, items } = req.body;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    if (status) {
      await connection.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
      
      // If completed, free up the table
      if (status === 'Completed') {
        const [orders] = await connection.execute('SELECT table_id FROM orders WHERE id = ?', [id]);
        if (orders.length > 0) {
          await connection.execute(
            'UPDATE tables SET status = ?, current_order_id = NULL WHERE id = ?',
            ['Available', orders[0].table_id]
          );
        }
      }
    }
    
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await connection.execute(
          'UPDATE order_items SET preparation_progress = ? WHERE order_id = ? AND menu_item_id = ?',
          [item.preparationProgress || item.progress || 0, id, item.id]
        );
      }
    }
    
    await connection.commit();
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
