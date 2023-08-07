const mysql = require("mysql2/promise");
const dbConfig = require("./db-config");
const pool = mysql.createPool(dbConfig);

async function getQuestionsFromDB(test_id) {
  const dbResponse = await pool.query(`SELECT * FROM test_question WHERE test_id=?;`, [test_id]);
  return dbResponse[0];
}

async function getOptionsFromDB(test_id) {
  const dbResponse = await pool.query(`SELECT * FROM question_response WHERE question_id IN (SELECT question_id FROM test_question WHERE test_id=${mysql.escape(test_id)});`);
  return dbResponse[0];
}

async function getQuestionOptions(question_id) {
  const dbResponse = await pool.query(`SELECT * FROM question_response WHERE question_id=?;`, [question_id]);
  return dbResponse[0];
}

async function getAprobations(test_id) {
  const dbResponse = await pool.query(`SELECT * FROM scale_direction WHERE test_id=?;`, [test_id]);
  return dbResponse[0];
}

module.exports = {
  getQuestionsFromDB: getQuestionsFromDB,
  getQuestionOptions: getQuestionOptions,
  getOptionsFromDB: getOptionsFromDB,
  getAprobations: getAprobations,
};

