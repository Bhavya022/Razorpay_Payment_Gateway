
// import mongoose from "mongoose";

// const connectToMongo = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://bhavya:bhavya@cluster0.kin5ecd.mongodb.net/paymentGateway?retryWrites=true&w=majority', {

//     });
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection failed", error.message);
//     process.exit(1);
//   }
// };

// export default connectToMongo;   

// CREATE DATABASE IF NOT EXISTS topskill_db;
// USE topskill_db;

// CREATE TABLE IF NOT EXISTS users (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   role ENUM('user', 'admin') DEFAULT 'user',
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE IF NOT EXISTS courses (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   title VARCHAR(255) NOT NULL,
//   description TEXT NOT NULL,
//   price DECIMAL(10, 2) NOT NULL,
//   original_price DECIMAL(10, 2) NOT NULL,
//   image VARCHAR(255) NOT NULL,
//   category VARCHAR(100) NOT NULL,
//   rating DECIMAL(3, 2) DEFAULT 0,
//   duration VARCHAR(50) NOT NULL,
//   lessons INT NOT NULL,
//   students INT DEFAULT 0,
//   instructor VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE IF NOT EXISTS course_modules (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   course_id INT NOT NULL,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   order_num INT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
// );

// CREATE TABLE IF NOT EXISTS user_courses (
//   user_id INT NOT NULL,
//   course_id INT NOT NULL,
//   purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (user_id, course_id),
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//   FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
// );


// CREATE TABLE IF NOT EXISTS enquiries (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name TEXT NOT NULL,
//   email TEXT NOT NULL,
//   mobile TEXT NOT NULL,
//   message TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


// ALTER TABLE course_syllabus
//   ADD COLUMN video_url TEXT,
//   ADD COLUMN brochure_url TEXT,
//   ADD COLUMN ebook_urls VARCHAR(1000) DEFAULT '[]',
//   ADD COLUMN batch_start_date DATE,
//   ADD COLUMN batch_size INT DEFAULT 30;     


//    ALTER TABLE users 
// ADD COLUMN image TEXT;     


// CREATE TABLE IF NOT EXISTS payments (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   razorpay_order_id VARCHAR(255) NOT NULL,
//   razorpay_payment_id VARCHAR(255) NOT NULL,
//   razorpay_signature VARCHAR(255) NOT NULL,
//   user_id INT NOT NULL,  -- Link payment to user
//   status ENUM('success', 'failed') NOT NULL,  -- Track success or failure
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );


// -- Insert admin user (password: admin123)
// INSERT INTO users (name, email, password, role)
// VALUES (
//   'Admin',
//   'admin@topskill.com',
//   '$2a$10$XgXB8mU6TzCF.hP1S7U2.OQF9yZ9XHgX9X9X9X9X9X9X9X9X9X',
//   'admin'
// );  


import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'bhavya@22',
  database: 'topskill_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


pool.getConnection((err, connection) => {
    if (err) {
      console.error(' Database connection failed:', err.message);
    } else {
      console.log('MySQL Database connected successfully.');
      connection.release(); 
    }
  });
export default pool;
