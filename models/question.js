const mysql = require("mysql2");
const dbConfig = require("./db-config");

const pool = mysql.createPool(dbConfig);

pool.query("SELECT * FROM subjects", (err, results) => {
  if (err) {
    console.error("Ошибка при выполнении запроса:", err);
    return;
  }
  console.log("Результаты запроса:", results);
});
