const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    console.log('Connecting to MySQL...');
    // Connect without database first to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true // Allow multiple SQL statements in one query
    });
    
    console.log('Connected successfully. Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    
    console.log('Database and tables created successfully, and seeded with data!');
    
  } catch (err) {
    console.error('Failed to setup database:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
