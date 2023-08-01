const mysql = require("mysql2/promise");
const dbConfig = require("./db-config");
const pool = mysql.createPool(dbConfig);

async function getQuestionsFromDB() {
  const dbResponse = await pool.query("SELECT name FROM subjects");
  return dbResponse[0];
}

module.exports = {
  getQuestionsFromDB: getQuestionsFromDB,
};

