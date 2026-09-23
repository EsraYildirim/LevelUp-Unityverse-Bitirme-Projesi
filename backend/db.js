// MySQL bağlantısı
// server.js buradaki havuzu (pool) kullanarak veritabanına sorgu atar.

//! Bağlantı bilgileri artık kodda değil, .env dosyasında duruyor.
//! dotenv o dosyayı okuyup process.env içine aktarır.
require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  // DATE sütunları "1995-04-12" gibi düz metin gelsin (input type="date" bunu bekler)
  dateStrings: true,
  // DECIMAL sütunları metin değil sayı olarak gelsin (fiyat hesapları için)
  decimalNumbers: true,
});

// async/await ile kullanabilmek için promise sürümünü dışa aktarıyoruz
module.exports = pool.promise();
