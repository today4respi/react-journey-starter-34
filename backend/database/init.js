
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

// Read SQL file
const sql = fs.readFileSync(path.join(__dirname, "schema.sql")).toString();

// Execute SQL queries
connection.query(sql, (err) => {
  if (err) {
    console.error("Error executing SQL:", err);
    process.exit(1);
  }
  console.log("Database and tables created successfully!");
  console.log("Test users inserted successfully!");
  connection.end();
});
