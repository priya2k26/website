const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const passwords = ['', 'root', 'admin', 'password', '123456'];
    let connection;
    let successfulPassword = null;
    
    for (const p of passwords) {
      try {
        connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: p,
        });
        successfulPassword = p;
        break;
      } catch (e) {
        // ignore
      }
    }
    
    if (connection) {
      console.log('Successfully connected to MySQL with password:', successfulPassword);
      const [rows] = await connection.query('SHOW DATABASES');
      console.log('Databases:', rows.map(r => r.Database));
      await connection.end();
    } else {
      console.log('All common passwords failed.');
    }
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
