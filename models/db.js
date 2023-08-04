const mysql = require("mysql2/promise");
const dbConfig = require("./db-config");
const pool = mysql.createPool(dbConfig);

async function getQuestionsFromDB(test_id) {
  const dbResponse = await pool.query(`SELECT * FROM test_question WHERE test_id=?;`, [test_id]);
  return dbResponse[0];
}

async function getQuestionOptions(question_id) {
  const dbResponse = await pool.query(`SELECT * FROM question_response WHERE question_id=?;`, [question_id]);
  return dbResponse[0];
}

module.exports = {
  getQuestionsFromDB: getQuestionsFromDB,
  getQuestionOptions: getQuestionOptions
};

