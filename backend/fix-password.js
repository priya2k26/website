const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPassword() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      ['$2b$10$jGYJHx6g3jEEbFz0T8bfw.y9vtnZHc.krHsFbF5LglnhapxMzdwNG', 'admin@restaurant.com']
    );
    console.log('Password fixed in DB');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) await connection.end();
  }
}

fixPassword();
